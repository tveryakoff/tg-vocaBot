import SelectDictionaryMenuFacade from '../SelectDictionaryMenuFacade'
import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import manageDictionarySubMenu from '../ManageDictionary'

export const selectEditDictionaryMenu = new SelectDictionaryMenuFacade({
  id: 'selectEditDictionary',
  getDictionaries: async (ctx) => {
    return await ctx.loadDictionariesNames(['name'])
  },
  onSelect: async (ctx: MyContext & { menu: MenuControlPanel }, dict) => {
    const contextData = ctx.getDialogContext('manageDictionary')
    ctx.setDialogContext('manageDictionary', { ...contextData, editDictId: dict?._id.toString() })
    ctx.menu.nav('manageDictionaryMenu')
  },
})

selectEditDictionaryMenu.register(manageDictionarySubMenu)
