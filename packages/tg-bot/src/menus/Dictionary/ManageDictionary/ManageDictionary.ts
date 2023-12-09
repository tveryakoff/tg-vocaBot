import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'

export type Options = {
  id: string
  onChangeName: (ctx: MyContext) => unknown
  onEditWords: (ctx: MyContext & { menu: MenuControlPanel }) => unknown
  onDictionaryDelete: (ctx: MyContext) => unknown
}

export default class ManageDictionaryMenu extends Menu<MyContext> {
  constructor({ id, onChangeName, onEditWords, onDictionaryDelete }: Options) {
    super(id)

    this.text('Change name', (ctx) => onChangeName(ctx))
      .row()
      .text('Edit words', async (ctx) => {
        onEditWords(ctx)
      })
      .row()
      .text('Delete', (ctx) => onDictionaryDelete(ctx))
      .row()
  }
}
