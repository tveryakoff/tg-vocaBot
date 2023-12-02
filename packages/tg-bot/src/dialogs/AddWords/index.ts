import { Dialog } from '../index'
import { MyContext } from '../../context'
import { ADD_WORDS_STAGE } from '../types'
import { DictionaryMongooseHydrated } from '../../../../../types/user'

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
    const session = this.ctx.session

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
