import ManageDictionaryMenu from './ManageDictionary'
import EditWordMenu from '../../EditWord/EditWordMenu'
import { deleteWord } from './handlers'
import SelectWordOrTranslationSubMenu from '../../EditWord/SelectWordOrTranslationSubMenu'
import { MANAGE_DICTIONARY_STAGE } from '../../../dialogs/types'

const editDictionaryWordsSubmenuId = 'editDictionaryWordsSubmenu'
const selectDictionaryWordOrTranslationSubmenuId = 'selectDictionaryWordOrTranslationSubmenuId'

const manageDictionaryMenu = new ManageDictionaryMenu({
  id: 'manageDictionaryMenu',
  onChangeName: (ctx) => {
    console.log('change name')
  },
  onEditWords: (ctx) => {
    const contextData = ctx.getDialogContext('manageDictionary')
    ctx.setDialogContext('manageDictionary', { ...contextData, stage: MANAGE_DICTIONARY_STAGE.EDIT_DICT_WORDS })
    return ctx.menu.nav(editDictionaryWordsSubmenuId)
  },
  onDictionaryDelete: () => {
    console.log('delete')
  },
})

export const editDictionaryWordsSubmenu = new EditWordMenu({
  id: editDictionaryWordsSubmenuId,
  getData: (ctx) => ctx.getDialogContext('manageDictionary'),
  setData: (ctx, data) => ctx.setDialogContext('manageDictionary', data),
  getDictId: (ctx) => ctx.editDictionaryId,
  onDeleteWord: deleteWord,
  onWordSelect: (ctx, word) => {
    const contextData = ctx.getDialogContext('manageDictionary')
    ctx.setDialogContext('manageDictionary', { ...contextData, word })
    return ctx.menu.nav(selectDictionaryWordOrTranslationSubmenuId)
  },
})

const selectWordOrTranslationSubmenu = new SelectWordOrTranslationSubMenu({
  id: 'selectDictionaryWordOrTranslationSubmenuId',
  getData: (ctx) => ctx.getDialogContext('manageDictionary'),
  gotToEditWordValue: (ctx, word) => {
    const contextData = ctx.getDialogContext('manageDictionary')
    ctx.enterDialog('manageDictionary', { ...contextData, stage: MANAGE_DICTIONARY_STAGE.EDIT_WORD_VALUE_START, word })
  },
  gotToEditWordTranslation: (ctx, word) => {
    const contextData = ctx.getDialogContext('manageDictionary')
    return ctx.enterDialog('manageDictionary', {
      ...contextData,
      stage: MANAGE_DICTIONARY_STAGE.EDIT_WORD_TRANSLATION_START,
      word,
    })
  },
  goBack: (ctx) => ctx.menu.back(),
})

editDictionaryWordsSubmenu.row().back('Go back')
editDictionaryWordsSubmenu.register(selectWordOrTranslationSubmenu)
manageDictionaryMenu.register(editDictionaryWordsSubmenu)

export default manageDictionaryMenu
