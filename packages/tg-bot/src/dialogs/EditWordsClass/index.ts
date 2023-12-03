import { Dialog } from '../index'
import { MyContext } from '../../context'
import { INITIAL_DIALOG_STATE } from '../constants'
import { DIALOG_STATE, DialogName, EDIT_WORDS_STAGE } from '../types'
import editWordMenuType from '../../menus/EditWord'

export class EditWords extends Dialog<'editWords'> {
  constructor(ctx: MyContext) {
    super(ctx)
    this.name = 'editWords'
    this.initialState = { ...INITIAL_DIALOG_STATE.editWords }
  }

  async gate() {
    let dialogName: DialogName = 'start'
    let canPass = true
    if (!this.ctx.user || !this.ctx.activeDictionary) {
      dialogName = 'start'
      canPass = false
    }

    const words = this.ctx?.activeDictionary?.words

    if (!words?.length) {
      await this.ctx.reply(`Your dictionary is empty! Try adding some vocab instead`)
      dialogName = 'addWords'
      canPass = false
    }

    return {
      canPass,
      dialogName,
    }
  }

  async start(initialState?: DIALOG_STATE['editWords']) {
    super.start(initialState)

    const { stage, word } = this.contextState

    if (!stage || stage === EDIT_WORDS_STAGE.DEFAULT) {
      return await this.ctx.reply(`Choose the word you want to edit:`, { reply_markup: editWordMenuType })
    }

    if (stage === EDIT_WORDS_STAGE.WORD_EDIT_START) {
      this.contextState = { ...this.contextState, stage: EDIT_WORDS_STAGE.WORD_EDIT_END }
      return await this.ctx.reply(`Type in a replacement for "${word?.value}"`)
    }

    if (stage === EDIT_WORDS_STAGE.TRANSLATION_EDIT_START) {
      this.contextState = { ...this.contextState, stage: EDIT_WORDS_STAGE.TRANSLATION_EDIT_END }

      return await this.ctx.reply(`Type in a replacement for "${word?.translation}"`)
    }
  }

  async handleTextInput(): Promise<any> {
    const { stage, word, page } = this.contextState

    if (stage === EDIT_WORDS_STAGE.WORD_EDIT_END) {
      const wordValueInput = this.ctx.message.text

      const editedWord = await this.ctx.activeDictionary.editWord({
        _id: word?._id,
        value: wordValueInput,
      })

      await this.ctx.reply(
        `Pair "${word.value}" - "${word.translation}" \n\nHas been replaced with:\n\n"${editedWord.value}" - "${editedWord.translation}"
      `,
      )

      return this.start({ ...INITIAL_DIALOG_STATE.editWords, page: page || 0 })
    }

    if (stage === EDIT_WORDS_STAGE.TRANSLATION_EDIT_END) {
      const wordTranslationInput = this.ctx.message.text

      const editedWord = await this.ctx.activeDictionary.editWord({
        _id: word._id,
        translation: wordTranslationInput,
      })

      await this.ctx.reply(
        `Pair "${word.value}" - ${word.translation} \n\nHas been replaced with:\n\n
      "${editedWord.value}" - "${editedWord.translation}"
      `,
      )

      return this.start({ ...INITIAL_DIALOG_STATE.editWords, page: page || 0 })
    }
  }
}
