import { MyContext } from '../../../context'
import { Menu } from '@grammyjs/menu'
import { Dictionary } from '../../../../../../services/db/DataAcessLayer'

type Params = {
  id: string
  onSelect: (ctx: MyContext, dict: Dictionary) => any
}

class SelectDictionaryMenu extends Menu<MyContext> {
  private onSelect: (ctx: MyContext, dict: Dictionary) => any

  constructor({ id, onSelect }: Params) {
    super(id)
    this.onSelect = onSelect

    this.row().dynamic(async (ctx, range) => {
      //@ts-ignore
      const dictionaries: Array<{ name: string; _id: string }> = await ctx.user.getPopulatedDictionaries(['name'])
      for (const dict of dictionaries) {
        //@ts-ignore
        range.text(dict?.name, async (ctx) => this.onSelect(ctx, dict)).row()
      }
    })
  }
}

export default SelectDictionaryMenu
