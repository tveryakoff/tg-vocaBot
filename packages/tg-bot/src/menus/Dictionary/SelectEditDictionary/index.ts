import SelectDictionaryMenuFacade from '../SelectDictionaryMenuFacade'
import { editSelectedDictionarySubmenu } from '../EditDictionary'
import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'

const selectEditDictionaryMenuObj = new SelectDictionaryMenuFacade({
  id: 'selectEditDictionary',
  getDictionaries: async (ctx) => {
    return await ctx.loadDictionariesNames(['name'])
  },
  onSelect: async (ctx: MyContext & { menu: MenuControlPanel }, dict) => {
    ctx.setEditDictionary(dict?._id.toString())
    ctx.menu.nav('editSelectedDictionarySubmenu')
  },
})

selectEditDictionaryMenuObj.menu.register(editSelectedDictionarySubmenu)

export const editActiveDictionaryMenu = selectEditDictionaryMenuObj.menu
