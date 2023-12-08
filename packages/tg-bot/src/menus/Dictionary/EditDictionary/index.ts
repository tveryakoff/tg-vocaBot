import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../../context'
import { MANAGE_DICTIONARY_STAGE } from '../../../dialogs/types'

export class EditDictionaryMenuFacade {
  private readonly id: string
  public readonly menu: Menu<MyContext>

  constructor(id: string, goBack?: boolean) {
    this.id = id
    this.menu = new Menu<MyContext>(this.id)

    this.menu
      .text('Change name', (ctx) => ctx.enterDialog('manageDictionary', { stage: MANAGE_DICTIONARY_STAGE.CHANGE_NAME }))
      .row()
      .text('Edit words')
      .row()
      .text('Delete', (ctx) => ctx.enterDialog('manageDictionary', { stage: MANAGE_DICTIONARY_STAGE.DELETE_DICT }))
      .row()

    if (goBack) {
      this.menu.text('Go back', (ctx) => ctx.menu.back())
    }
  }
}

const editDictionaryMenuObj = new EditDictionaryMenuFacade('editDictionaryMenu')
const editSelectedDictionarySubmenuObj = new EditDictionaryMenuFacade('editSelectedDictionarySubmenu', true)

export const editDictionaryMenu = editDictionaryMenuObj.menu
export const editSelectedDictionarySubmenu = editSelectedDictionarySubmenuObj.menu
