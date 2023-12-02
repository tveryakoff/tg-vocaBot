import { Api, Context } from 'grammy'
import { DictionaryMongooseHydrated, UserMongooseHydrated } from '../../../../types/user'
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

  getDialogContext(dialogName: DialogName) {
    return this.session[dialogName]
  }

  setDialogContext<T extends DialogName>(name: T, context: DIALOG_STATE[T]) {
    this.session[name] = { ...context }
  }

  async loadDataIntoContext() {
    const { user, activeDictionary } = await User.createIfNotExits(
      mapTgUserFromToUser(this.from),
      this.session.activeDictionaryId,
    )

    this.user = user
    this.activeDictionary = activeDictionary

    const activeDialogName = this?.session?.activeDialogName

    if (activeDialogName) {
      const dialog = createDialogInstance(activeDialogName, this)
      if (dialog) {
        this.dialog = dialog
      }
    }
  }

  async enterDialog(dialogName: DialogName, initialState?: DIALOG_STATE[DialogName]) {
    if (dialogName !== this.session.activeDialogName) {
      this.session.activeDialogName = dialogName
    }

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
