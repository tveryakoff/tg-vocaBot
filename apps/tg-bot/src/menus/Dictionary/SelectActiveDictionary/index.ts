import SelectDictionaryMenuFacade from '../SelectDictionaryMenuFacade'
import { addOrLearnMenu } from '../../AddOrLearn'

export const selectActiveDictionaryMenu = new SelectDictionaryMenuFacade({
  id: 'selectActiveDictionary',
  onSelect: async (ctx, dict) => {
    await ctx.setActiveDictionary(dict?._id?.toString())
    return await ctx.reply(`You have set "<b>${dict.name}</b>" as your active dictionary!`, {
      parse_mode: 'HTML',
      reply_markup: addOrLearnMenu,
    })
  },
})
