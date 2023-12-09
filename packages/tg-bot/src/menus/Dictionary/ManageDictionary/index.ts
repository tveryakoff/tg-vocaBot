import ManageDictionaryMenu from './ManageDictionary'
import EditWordMenu from '../../EditWord/EditWordMenu'
import { deleteWord } from './handlers'

const editDictionaryWordsSubmenuId = 'editDictionaryWordsSubmenu'

const manageDictionaryMenu = new ManageDictionaryMenu({
  id: 'manageDictionaryMenu',
  onChangeName: (ctx) => {
    console.log('change name')
  },
  onEditWords: (ctx) => {
    return ctx.menu.nav(editDictionaryWordsSubmenuId)
  },
  onDictionaryDelete: () => {
    console.log('delete')
  },
})

const editDictionaryWordsSubmenu = new EditWordMenu({
  id: editDictionaryWordsSubmenuId,
  getData: (ctx) => ctx.getDialogContext('manageDictionary'),
  setData: (ctx, data) => ctx.setDialogContext('manageDictionary', data),
  getDictId: (ctx) => ctx.editDictionaryId,
  onDeleteWord: deleteWord,
  onWordSelect: (ctx) => {
    console.log('select')
  },
})

editDictionaryWordsSubmenu.row().back('Go back')
manageDictionaryMenu.register(editDictionaryWordsSubmenu)

export default manageDictionaryMenu
