import { Dialog } from '../index'
import { MyContext } from '../../context'
import { ADD_WORDS_STAGE, DIALOG_STATE } from '../types'

export class AddWordsDialog extends Dialog {
  constructor(ctx: MyContext) {
    super(ctx)
    this.ctx = ctx
    this.name = 'addWords'
    this.initialState = { stage: ADD_WORDS_STAGE.DEFAULT, word: null }
  }

  async start(initialState?: DIALOG_STATE['addWords']) {
    if (!this.ctx.user || !this.ctx.activeDictionary) {
      await this.ctx.reply(`Seems like you don't have a dictionary yet, let me create one for you!`)
      return await this.enterDialog('start')
    }

    await super.start(initialState)

    const state = this.contextState

    const stage = state.stage

    if (!stage || stage === ADD_WORDS_STAGE.DEFAULT) {
      this.contextState = { stage: ADD_WORDS_STAGE.WORD }
      return await this.ctx.reply(`Type in a word which you'd like to add:`)
    }
  }

  async handleTextInput() {
    const state = this.contextState
    const activeDictionary = this.ctx.activeDictionary

    const stage = state.stage
    if (stage === ADD_WORDS_STAGE.WORD) {
      const wordValue = this.ctx?.message?.text

      if (!wordValue) {
        return await this.ctx.reply(`Word can't be empty!`)
      }

      if (await activeDictionary.hasWord(wordValue)) {
        return await this.ctx.reply(
          `"${wordValue.toLowerCase().trim()}" already exists in that dictionary, try to add another word:`,
        )
      }
      this.contextState = { stage: ADD_WORDS_STAGE.TRANSLATION, word: this.ctx.message?.text }

      return await this.ctx.reply(`Type in a translation for ${this.ctx.message?.text}`)
    } else if (stage === ADD_WORDS_STAGE.TRANSLATION) {
      const translation = this.ctx.message?.text

      if (!translation) {
        return await this.ctx.reply(`Translation can't be empty!`)
      }
      if (!state.word) {
        throw new Error('No word is set for the translation')
      }

      if (await activeDictionary.hasWord(state.word, translation)) {
        return await this.ctx.reply(
          `Translation "${translation
            .toLowerCase()
            .trim()}" already exists in that dictionary!\n\nAdd another translation for "${state.word}":`,
        )
      }

      const value = state.word

      const { justAdded, message } = await activeDictionary.addWord({
        value,
        translation: translation || '',
      })

      this.contextState = { stage: ADD_WORDS_STAGE.WORD, word: null }

      if (justAdded) {
        return await this.ctx.reply(
          `A new pair ${justAdded.value} - ${justAdded.translation} has been added to ${activeDictionary.name}!\n\nEnter a new word:`,
        )
      } else {
        return await this.ctx.reply(`${message ? message : 'An error occurred during adding word, try again later'}`)
      }
    }
  }
}
