import { Api, Context } from 'grammy'
import { DIALOG_STATE, DialogName } from '../dialogs/types'
import { Update, UserFromGetMe } from 'grammy/types'
import { Dialog } from '../dialogs'
import { SessionData } from './types'
import { mapTgUserFromToUser } from '../auth/mapTgUserFromToUser'
import { createDialogInstance, DIALOG_NAMES } from './constants'
import DbAccessLayer, { User, Dictionary } from '../../../../services/db/DataAcessLayer'

export class MyContext extends Context {
  user: User
  public activeDictionary: Dictionary | null
  public session: SessionData
  public dialog: Dialog

  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me)
  }

  get activeDictionaryId() {
    return this.session.activeDictionaryId
  }

  getDialogContext<T extends DialogName>(dialogName: T): DIALOG_STATE[T] {
    return this.session[dialogName]
  }

  setDialogContext<T extends DialogName>(name: T, context: DIALOG_STATE[T]) {
    this.session[name] = { ...context }
  }

  async setActiveDictionary(dictId: string) {
    this.session.activeDictionaryId = dictId
    this.activeDictionary = await DbAccessLayer.getDictionary(dictId)
  }

  async deleteDictionary(deleteDictId: string) {
    const canDelete = this.user.dictionaries.length > 1
    if (!canDelete) {
      return
    }

    const isActive = deleteDictId === this.session.activeDictionaryId

    await this.user.deleteDictionary(deleteDictId)
    const dictId = this.user.dictionaries?.[0]._id.toString()

    if (isActive) {
      await this.setActiveDictionary(dictId)
    }

    return
  }

  async loadDataIntoContext() {
    this.user = await DbAccessLayer.createUserIfNotExists(mapTgUserFromToUser(this.from))

    if (!this.user) {
      throw new Error('User not found')
    }

    if (this.session.activeDictionaryId) {
      await this.setActiveDictionary(this.session.activeDictionaryId)
    }

    const activeDialogName = this?.session?.activeDialogName

    if (activeDialogName) {
      const dialog = createDialogInstance(activeDialogName, this)
      if (dialog) {
        this.dialog = dialog
      }
    }
  }

  async clearDialogSessionData() {
    for (const dialogName of DIALOG_NAMES) {
      delete this.session[dialogName]
    }
  }

  async enterDialog(dialogName: DialogName, initialState?: DIALOG_STATE[DialogName]) {
    const dialog = createDialogInstance(dialogName, this)
    await this.clearDialogSessionData()

    if (dialog) {
      this.dialog = dialog
      return await this.dialog.start(initialState)
    }

    throw new Error(`Dialog class ${dialogName} doesn't exist`)
  }

  async handleDialogTextInput() {
    return await this.dialog.handleTextInput()
  }

  async handleDialogUpdate() {
    return await this.dialog.handleAnyUpdate()
  }
}
