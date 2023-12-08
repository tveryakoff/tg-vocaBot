import SelectDictionaryMenuFacade from '../SelectDictionaryMenuFacade'
import { addOrLearnMenu } from '../../AddOrLearn'

export const selectActiveDictionaryMenu = new SelectDictionaryMenuFacade({
  id: 'selectActiveDictionary',
  getDictionaries: async (ctx) => {
    return await ctx.loadDictionariesNames(['name'])
  },
  onSelect: async (ctx, dict) => {
    ctx.setActiveDictionary(dict?._id.toString())
    return await ctx.reply(`You have set ${dict.name} as your active dictionary!`, { reply_markup: addOrLearnMenu })
  },
})
