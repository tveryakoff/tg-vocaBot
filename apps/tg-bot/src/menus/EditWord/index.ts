import { MyContext } from '../../context'
import { deleteWord, goBack, goToEditWordTranslation, goToEditWordValue } from './handlers'
import EditWordMenu from './EditWordMenu'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import SelectWordOrTranslationSubMenu from './SelectWordOrTranslationSubMenu'

const selectWordOrTranslationSubmenuId = 'selectWordOrTranslationSubmenu'

const editWordsMenu = new EditWordMenu({
  id: 'editWordsMenu',
  getData: (ctx) => ctx.getDialogContext('editWords'),
  setData: (ctx, data) => ctx.setDialogContext('editWords', data),
  getDictId: (ctx) => ctx.activeDictionary?._id,
  onDeleteWord: deleteWord,
  onWordSelect: (ctx: MyContext & { menu: MenuControlPanel }, word) => {
    const contextData = ctx.getDialogContext('editWords')
    ctx.setDialogContext('editWords', { ...contextData, word })
    return ctx.menu.nav(selectWordOrTranslationSubmenuId)
  },
})

const selectWordOrTranslationSubMenu = new SelectWordOrTranslationSubMenu({
  id: selectWordOrTranslationSubmenuId,
  getData: (ctx) => ctx.getDialogContext('editWords'),
  gotToEditWordValue: goToEditWordValue,
  gotToEditWordTranslation: goToEditWordTranslation,
  goBack: goBack,
})

editWordsMenu.register(selectWordOrTranslationSubMenu)

export default editWordsMenu
