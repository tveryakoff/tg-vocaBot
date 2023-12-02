import { Api, Context } from 'grammy'
import { DictionaryMongooseHydrated, UserMongooseHydrated } from '../../../../types/user'
import { ADD_WORDS_STAGE, DIALOG_STATE, DialogName } from '../dialogs/types'
import { userResolver } from '../../../../services/db/resolvers/user'
import { mapTgUserFromToUser } from '../auth/mapTgUserFromToUser'
import { Update, UserFromGetMe } from 'grammy/types'
import { Dialog } from '../dialogs'
import { SessionData } from './types'

export class MyContext extends Context {
  user: UserMongooseHydrated | null
  public readonly activeDictionary: DictionaryMongooseHydrated | null
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

  getSessionData() {
    return this.session
  }

  async enterDialog(dialogName: DialogName, initialState?: DIALOG_STATE[DialogName]) {
    if (dialogName !== this.session.activeDialogName) {
      this.session.activeDialogName = dialogName
    }

    if (dialogName === 'addWords') {
      this.dialog = new AddWordsDialog(this)
      return await this.dialog.enter(initialState)
    }
  }

  async handleDialogTextInput() {
    return await this.dialog.handleTextInput()
  }

  async handleDialogUpdate() {
    return await this.dialog.handleAnyUpdate()
  }
}

export class AddWordsDialog extends Dialog {
  constructor(ctx: MyContext) {
    super(ctx)
    this.ctx = ctx
    this.name = 'addWords'
    this.initialState = { stage: ADD_WORDS_STAGE.DEFAULT, word: null }
  }

  async handleStart() {
    const state = this.ctx.getDialogContext(this.name)

    const stage = state.stage

    if (!stage || stage === ADD_WORDS_STAGE.DEFAULT) {
      this.ctx.setDialogContext(this.name, { stage: ADD_WORDS_STAGE.WORD })
      return await this.ctx.reply(`Type in a word which you'd like to add:`)
    }
  }

  async handleTextInput() {
    const state = this.ctx.getDialogContext(this.name)
    const session = this.ctx.getSessionData()

    const stage = state.stage
    if (stage === ADD_WORDS_STAGE.WORD) {
      const word = this.ctx?.message?.text

      if (!word) {
        return await this.ctx.reply(`Word can't be empty!`)
      }

      if (await this.ctx.user?.hasWordInDictionary(session.activeDictionaryId || '', word)) {
        return await this.ctx.reply(
          `"${word.toLowerCase().trim()}" already exists in that dictionary, try to add another word:`,
        )
      }
      this.ctx.setDialogContext(this.name, {
        stage: ADD_WORDS_STAGE.TRANSLATION,
        word: this.ctx.message?.text,
      })

      return await this.ctx.reply(`Type in a translation for ${this.ctx.message?.text}`)
    } else if (stage === ADD_WORDS_STAGE.TRANSLATION) {
      const translation = this.ctx.message?.text
      if (!translation) {
        return await this.ctx.reply(`Translation can't be empty!`)
      }
      await this.ctx.user?.populate<{ dictionaries: DictionaryMongooseHydrated[] }>('dictionaries')

      if (!state.word) {
        throw new Error('No word is set for the translation')
      }

      const value = state.word

      const { dictionary, justAdded } = await this.ctx.user?.addWordToDictionary({
        value,
        translation: translation || '',
        dictId: session?.activeDictionaryId,
      })

      this.ctx.setDialogContext(this.name, {
        stage: ADD_WORDS_STAGE.WORD,
        word: null,
      })

      return await this.ctx.reply(
        `A new pair ${justAdded.value} - ${justAdded.translation} has been added to ${dictionary.name}!\n\nEnter a new word:`,
      )
    }
  }
}
