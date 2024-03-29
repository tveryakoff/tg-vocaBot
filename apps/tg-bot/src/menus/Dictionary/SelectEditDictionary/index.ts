import SelectDictionaryMenuFacade from '../SelectDictionaryMenuFacade'
import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import manageDictionarySubMenu from '../ManageDictionary'

export const selectEditDictionaryMenu = new SelectDictionaryMenuFacade({
  id: 'selectEditDictionary',
  onSelect: async (ctx: MyContext & { menu: MenuControlPanel }, dict) => {
    const contextData = ctx.getDialogContext('manageDictionary')
    ctx.setDialogContext('manageDictionary', { ...contextData, page: 0, editDictId: dict?._id.toString() })
    ctx.menu.nav('manageDictionaryMenu')
  },
})

selectEditDictionaryMenu.register(manageDictionarySubMenu)
