import { MyContext } from '../../../context'
import { DictionaryMongooseHydrated } from '../../../../../../types/user'
import { Menu } from '@grammyjs/menu'

type Params = {
  id: string
  getDictionaries: (ctx: MyContext) => Promise<DictionaryMongooseHydrated[]>
  onSelect: (ctx: MyContext, dict: DictionaryMongooseHydrated) => any
}

class SelectDictionaryMenu {
  private readonly id: string
  private readonly getDictionaries: (ctx: MyContext) => Promise<DictionaryMongooseHydrated[]>
  private onSelect: (ctx: MyContext, dict: DictionaryMongooseHydrated) => any
  public menu: Menu<MyContext>

  constructor({ id, getDictionaries, onSelect }: Params) {
    this.id = id
    this.getDictionaries = getDictionaries
    this.onSelect = onSelect

    this.menu = new Menu<MyContext>(this.id)

    this.init()
  }

  async init() {
    return this.menu.row().dynamic(async (ctx, range) => {
      const dictionaries = await this.getDictionaries(ctx)
      for (const dict of dictionaries) {
        range.text(dict?.name, async (ctx) => this.onSelect(ctx, dict)).row()
      }
    })
  }
}

export default SelectDictionaryMenu
