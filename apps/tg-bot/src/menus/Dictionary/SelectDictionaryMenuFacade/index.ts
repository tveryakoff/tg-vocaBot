import { MyContext } from '../../../context'
import { DictionaryMongooseHydrated } from '../../../../../../types/user'
import { Menu } from '@grammyjs/menu'

type Params = {
  id: string
  getDictionaries: (ctx: MyContext) => Promise<DictionaryMongooseHydrated[]>
  onSelect: (ctx: MyContext, dict: DictionaryMongooseHydrated) => any
}

class SelectDictionaryMenu extends Menu<MyContext> {
  private readonly getDictionaries: (ctx: MyContext) => Promise<DictionaryMongooseHydrated[]>
  private onSelect: (ctx: MyContext, dict: DictionaryMongooseHydrated) => any

  constructor({ id, getDictionaries, onSelect }: Params) {
    super(id)
    this.getDictionaries = getDictionaries
    this.onSelect = onSelect

    this.row().dynamic(async (ctx, range) => {
      const dictionaries = await this.getDictionaries(ctx)
      for (const dict of dictionaries) {
        range.text(dict?.name, async (ctx) => this.onSelect(ctx, dict)).row()
      }
    })
  }
}

export default SelectDictionaryMenu
