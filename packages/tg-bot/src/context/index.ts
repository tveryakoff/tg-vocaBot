import { Api, Context } from 'grammy'
import { Dictionary, DictionaryMongooseHydrated, UserMongooseHydrated } from '../../../../types/user'
import { DIALOG_STATE, DialogName } from '../dialogs/types'
import { Update, UserFromGetMe } from 'grammy/types'
import { Dialog } from '../dialogs'
import { SessionData } from './types'
import { mapTgUserFromToUser } from '../auth/mapTgUserFromToUser'
import { createDialogInstance } from './constants'
import User from '../../../../services/db/models/user'

export class MyContext extends Context {
  user: UserMongooseHydrated | null
  public activeDictionary: DictionaryMongooseHydrated | null
  public readonly session: SessionData
  public dialog: Dialog

  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me)
  }

  getDialogContext<T extends DialogName>(dialogName: T): DIALOG_STATE[T] {
    return this.session[dialogName]
  }

  setDialogContext<T extends DialogName>(name: T, context: DIALOG_STATE[T]) {
    this.session[name] = { ...context }
  }

  setActiveDictionary(dictId: string) {
    this.session.activeDictionaryId = dictId
  }

  async loadDataIntoContext() {
    this.user = await User.createIfNotExits(mapTgUserFromToUser(this.from))

    if (!this.user) {
      throw new Error('User not found')
    }

    if (this.session.activeDictionaryId) {
      this.activeDictionary = await this.user.getDictionary(this.session.activeDictionaryId)
    }

    const activeDialogName = this?.session?.activeDialogName

    if (activeDialogName) {
      const dialog = createDialogInstance(activeDialogName, this)
      if (dialog) {
        this.dialog = dialog
      }
    }
  }

  async loadDictionariesNames(fields: Array<keyof Dictionary>) {
    if (this.user.populated('dictionaries')) {
      return
    }

    await this.user.populate('dictionaries', ...fields)
  }

  async enterDialog(dialogName: DialogName, initialState?: DIALOG_STATE[DialogName]) {
    const dialog = createDialogInstance(dialogName, this)

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
