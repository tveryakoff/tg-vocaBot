import { Dialog } from '../index'
import { MyContext } from '../../context'
import { DIALOG_STATE, MANAGE_DICTIONARY_STAGE } from '../types'
import { selectEditDictionaryMenu } from '../../menus/Dictionary/SelectEditDictionary'
import manageDictionaryMenu, { editDictionaryWordsSubmenu } from '../../menus/Dictionary/ManageDictionary'
import Dictionary from '../../../../../services/db/models/dictionary'
import { DictionaryMongooseHydrated } from '../../../../../types/user'
import { typeInReplacementFor, wordPairHasBeenReplaced } from '../../utils'

class ManageDictionary extends Dialog<'manageDictionary'> {
  constructor(ctx: MyContext) {
    super(ctx)
    this.initialState = {
      page: 0,
      stage: MANAGE_DICTIONARY_STAGE.DEFAULT,
    }
    this.name = 'manageDictionary'
  }

  selectEditDictionaryId() {
    if (this.contextState.editDictId) {
      return this.contextState.editDictId
    }
    if (this.ctx.user.dictionaries.length === 1 && this.ctx.activeDictionary) {
      const id = this.ctx.activeDictionary?._id.toString()
      this.contextState.editDictId = id
      return id
    }
  }

  async getEditDictionary(): Promise<DictionaryMongooseHydrated | null> {
    if (!this.contextState.editDictId) {
      return null
    }

    return Dictionary.findById(this.contextState.editDictId)
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
    const editDictId = this.selectEditDictionaryId()

    if (isInitial && editDictId) {
      const editDict = await this.getEditDictionary()
      return await this.ctx.reply(`Managing dictionary "<b>${editDict?.name}</b>"`, {
        parse_mode: 'HTML',
        reply_markup: manageDictionaryMenu,
      })
    }

    if (isInitial && !editDictId) {
      this.contextState.stage = MANAGE_DICTIONARY_STAGE.SELECT_DICT
      return await this.ctx.reply(`Select the dictionary you'd like to manage:`, {
        reply_markup: selectEditDictionaryMenu,
      })
    }

    if (stage === MANAGE_DICTIONARY_STAGE.EDIT_WORD_VALUE_START) {
      this.contextState.stage = MANAGE_DICTIONARY_STAGE.EDIT_WORD_VALUE_FINISH
      return await this.ctx.reply(...typeInReplacementFor(word.value))
    }

    if (stage === MANAGE_DICTIONARY_STAGE.EDIT_WORD_TRANSLATION_START) {
      this.contextState.stage = MANAGE_DICTIONARY_STAGE.EDIT_WORD_TRANSLATION_FINISH
      return await this.ctx.reply(...typeInReplacementFor(word.translation))
    }

    if (stage === MANAGE_DICTIONARY_STAGE.DELETE_DICT) {
      const dict = await this.getEditDictionary()

      this.contextState.stage = MANAGE_DICTIONARY_STAGE.DELETE_DICT_CONFIRM
      return await this.ctx.reply(
        `⚠️ Type <b>Yes</b> to confirm deleting "<b>${dict.name}</b>"
${!!dict.words.length ? `(It will delete ${dict.words.length} words)` : ''}`,
        { parse_mode: 'HTML' },
      )
    }

    if (stage === MANAGE_DICTIONARY_STAGE.CHANGE_NAME_START) {
      const dict = await this.getEditDictionary()
      if (!dict) {
        return
      }

      this.contextState.stage = MANAGE_DICTIONARY_STAGE.CHANGE_NAME_FINISH

      await this.ctx.reply(...typeInReplacementFor(dict.name))
    }
  }

  async handleTextInput(): Promise<any> {
    const { stage, word, page, editDictId } = this.contextState
    const dictionary = await Dictionary.findById(editDictId)

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

      await this.ctx.reply(...wordPairHasBeenReplaced(word, editedWord))

      this.contextState = { stage: MANAGE_DICTIONARY_STAGE.DEFAULT, page }
      return this.ctx.reply(`Editing "<b>${dictionary.name}<b/>" words:`, {
        parse_mode: 'HTML',
        reply_markup: editDictionaryWordsSubmenu,
      })
    }

    if (stage === MANAGE_DICTIONARY_STAGE.EDIT_WORD_TRANSLATION_FINISH) {
      const editedWord = await dictionary.editWord({
        _id: word._id,
        translation: textInput,
      })

      await this.ctx.reply(...wordPairHasBeenReplaced(word, editedWord))

      this.contextState = { stage: MANAGE_DICTIONARY_STAGE.DEFAULT, page }
      return this.ctx.reply(`Editing ${dictionary.name} words:`, { reply_markup: editDictionaryWordsSubmenu })
    }

    if (stage === MANAGE_DICTIONARY_STAGE.DELETE_DICT_CONFIRM && textInput.trim().toLowerCase() === 'yes') {
      await this.ctx.deleteDictionary(editDictId)
      await this.ctx.reply(`Dictionary "<b>${dictionary.name}</b>" has been deleted`, { parse_mode: 'HTML' })
      return await this.ctx.enterDialog('manageDictionary', { editDictId: this.ctx.activeDictionaryId })
    } else if (stage === MANAGE_DICTIONARY_STAGE.DELETE_DICT_CONFIRM) {
      await this.ctx.reply(`Deleting was canceled`)
      return await this.ctx.enterDialog('manageDictionary')
    }

    if (stage === MANAGE_DICTIONARY_STAGE.CHANGE_NAME_FINISH) {
      const textInput = this.ctx.message.text
      if (!textInput) {
        await this.ctx.reply(`A dictionary's name can't be empty`)
        return await this.ctx.enterDialog('manageDictionary', {
          ...this.contextState,
          stage: MANAGE_DICTIONARY_STAGE.CHANGE_NAME_START,
        })
      }

      const dict = await this.getEditDictionary()

      const newName = textInput.trim()
      //@ts-ignore
      await this.ctx.user.updateDictionary({ ...dict._doc, name: textInput.trim() })
      await this.ctx.reply(`🎉 The dictionary has been renamed to "<b>${newName}</b>"!`, { parse_mode: 'HTML' })

      return await this.ctx.enterDialog('manageDictionary')
    }
  }
}

export default ManageDictionary
