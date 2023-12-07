import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { DictionaryMongooseHydrated } from '../../../../../types/user'

export const selectActiveDictionaryMenu = new Menu<MyContext>('selectActiveDictionary')

selectActiveDictionaryMenu.row().dynamic(async (ctx, range) => {
  await ctx.loadDictionariesNames(['name'])
  const dictionaries = ctx.user.dictionaries as DictionaryMongooseHydrated[]
  for (const dict of dictionaries) {
    range
      .text(dict?.name, async (ctx) => {
        ctx.setActiveDictionary(dict?._id.toString())
        return await ctx.reply(`You have set ${dict.name} as your active dictionary!`)
      })
      .row()
  }
})
