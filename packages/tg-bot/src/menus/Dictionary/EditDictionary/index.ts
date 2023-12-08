import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../../context'
import { MANAGE_DICTIONARY_STAGE } from '../../../dialogs/types'

export class EditDictionaryMenuFacade extends Menu<MyContext> {
  constructor(id: string) {
    super(id)
    this.text('Change name', (ctx) =>
      ctx.enterDialog('manageDictionary', { stage: MANAGE_DICTIONARY_STAGE.CHANGE_NAME }),
    )
      .row()
      .text('Edit words', async (ctx) => {
        return ctx.enterDialog('editWords')
      })
      .row()
      .text('Delete', (ctx) => ctx.enterDialog('manageDictionary', { stage: MANAGE_DICTIONARY_STAGE.DELETE_DICT }))
      .row()
  }
}

export const editDictionaryMenu = new EditDictionaryMenuFacade('editDictionaryMenu')
export const editSelectedDictionarySubmenu = new EditDictionaryMenuFacade('editSelectedDictionarySubmenu')
