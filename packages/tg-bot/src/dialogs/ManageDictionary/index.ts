import { Dialog } from '../index'
import { MyContext } from '../../context'
import { DIALOG_STATE, MANAGE_DICTIONARY_STAGE } from '../types'
import { selectEditDictionaryMenu } from '../../menus/Dictionary/SelectEditDictionary'
import manageDictionaryMenu, { editDictionaryWordsSubmenu } from '../../menus/Dictionary/ManageDictionary'
import { INITIAL_DIALOG_STATE } from '../constants'
import Dictionary from '../../../../../services/db/models/dictionary'

class ManageDictionary extends Dialog<'manageDictionary'> {
  constructor(ctx: MyContext) {
    super(ctx)
    this.initialState = {
      page: 0,
      stage: MANAGE_DICTIONARY_STAGE.DEFAULT,
    }
    this.name = 'manageDictionary'
  }

  async start(initialState: DIALOG_STATE['manageDictionary']) {
    if (!this.ctx.user) {
      return await this.ctx.enterDialog('start')
    }

    if (!this.ctx.user.dictionaries.length) {
      await this.ctx.reply(`Seems like you don't have any dictionaries yer, let's create one`)
      return this.ctx.enterDialog('addDictionary')
    }

    await super.start(initialState)

    const { stage, word } = this.contextState

    const isInitial = !stage || stage === MANAGE_DICTIONARY_STAGE.DEFAULT
    const hasMany = this.ctx.user.dictionaries.length > 1

    if (isInitial && this.ctx.user.dictionaries.length === 1) {
      this.ctx.setEditDictionary(this.ctx.activeDictionary?._id)
      return await this.ctx.reply(`Manage dictionary`, { reply_markup: manageDictionaryMenu })
    }

    if (isInitial && hasMany) {
      this.contextState.stage = MANAGE_DICTIONARY_STAGE.SELECT_DICT
      return await this.ctx.reply(`Select the dictionary you'd like to manage:`, {
        reply_markup: selectEditDictionaryMenu,
      })
    }

    if (stage === MANAGE_DICTIONARY_STAGE.SELECT_DICT) {
      return await this.ctx.reply(`Manage dictionary`, { reply_markup: manageDictionaryMenu })
    }

    // TODO ADD GO BACK BUTTON
    if (stage === MANAGE_DICTIONARY_STAGE.EDIT_WORD_VALUE_START) {
      this.contextState.stage = MANAGE_DICTIONARY_STAGE.EDIT_WORD_VALUE_FINISH
      return await this.ctx.reply(`Type in a replacement for "${word?.value}"`)
    }

    if (stage === MANAGE_DICTIONARY_STAGE.EDIT_WORD_TRANSLATION_START) {
      this.contextState.stage = MANAGE_DICTIONARY_STAGE.EDIT_WORD_TRANSLATION_FINISH
      return await this.ctx.reply(`Type in a replacement for "${word?.translation}"`)
    }
  }

  async handleTextInput(): Promise<any> {
    const { stage, word, page } = this.contextState
    const dictId = this.ctx.editDictionaryId
    const dictionary = await Dictionary.findById(dictId)

    if (!dictionary) {
      return
    }

    const textInput = this.ctx.message.text

    if (!textInput) {
      await this.ctx.reply(`Word can't be empty`)
      return await this.ctx.enterDialog('manageDictionary', { stage, word, page })
    }

    if (stage === MANAGE_DICTIONARY_STAGE.EDIT_WORD_VALUE_FINISH) {
      const editedWord = await dictionary.editWord({
        _id: word?._id,
        value: textInput,
      })

      await this.ctx.reply(
        `Pair "${word.value}" - "${word.translation}" \n\nHas been replaced with:\n\n"${editedWord.value}" - "${editedWord.translation}"
      `,
      )

      this.contextState = { stage: MANAGE_DICTIONARY_STAGE.DEFAULT, page }
      return this.ctx.reply(`Editing ${dictionary.name} words:`, { reply_markup: editDictionaryWordsSubmenu })
    }

    if (stage === MANAGE_DICTIONARY_STAGE.EDIT_WORD_TRANSLATION_FINISH) {
      const editedWord = await dictionary.editWord({
        _id: word._id,
        translation: textInput,
      })

      await this.ctx.reply(
        `Pair "${word.value}" - ${word.translation} \n\nHas been replaced with:\n\n
      "${editedWord.value}" - "${editedWord.translation}"
      `,
      )

      this.contextState = { stage: MANAGE_DICTIONARY_STAGE.DEFAULT, page }
      return this.ctx.reply(`Editing ${dictionary.name} words:`, { reply_markup: editDictionaryWordsSubmenu })
    }
  }
}

export default ManageDictionary
