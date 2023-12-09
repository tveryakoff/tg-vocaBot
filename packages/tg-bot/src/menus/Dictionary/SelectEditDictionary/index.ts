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
    ctx.setEditDictionary(dict?._id.toString())
    ctx.menu.nav('manageDictionaryMenu')
  },
})

// export const editSelectedDictionarySubmenu = new EditDictionaryMenuFacade('editSelectedDictionarySubmenu')
//

//
selectEditDictionaryMenu.register(manageDictionarySubMenu)
