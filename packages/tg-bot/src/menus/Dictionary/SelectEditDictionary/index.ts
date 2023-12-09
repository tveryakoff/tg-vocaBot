import SelectDictionaryMenuFacade from '../SelectDictionaryMenuFacade'
import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'

export const selectEditDictionaryMenu = new SelectDictionaryMenuFacade({
  id: 'selectEditDictionary',
  getDictionaries: async (ctx) => {
    return await ctx.loadDictionariesNames(['name'])
  },
  onSelect: async (ctx: MyContext & { menu: MenuControlPanel }, dict) => {
    ctx.setEditDictionary(dict?._id.toString())
    ctx.menu.nav('editSelectedDictionarySubmenu')
  },
})

// export const editSelectedDictionarySubmenu = new EditDictionaryMenuFacade('editSelectedDictionarySubmenu')
//
// editSelectedDictionarySubmenu.row().text('Go back', (ctx) => ctx.menu.back())
//
// selectEditDictionaryMenu.register(editSelectedDictionarySubmenu)
