import { MyContextType } from '../types/context'
import { DictionaryMongooseHydrated } from '../../../../types/user'
import { Middleware } from 'grammy'

const addWords: Middleware<MyContextType> = async (ctx, next) => {
  const state = ctx.session.state
  if (!state || (state !== 'addWord' && state !== 'addTranslation' && state !== 'addWordEnter')) {
    return await next()
  }

  if (state === 'addWordEnter') {
    ctx.session.state = 'addWord'
    return await ctx.reply(`Type in a word which you'd like to add:`)
  }

  if (state === 'addWord') {
    if (!ctx?.message?.text) {
      return await ctx.reply(`Word can't be empty!`)
    }
    ctx.session.addWords = {
      word: ctx.message?.text,
    }

    ctx.session.state = 'addTranslation'
    return await ctx.reply(`Type in a translation for ${ctx.message?.text}`)
  } else if (ctx.session.state === 'addTranslation') {
    const translation = ctx.message?.text
    if (!translation) {
      return await ctx.reply(`Translation can't be empty!`)
    }
    ctx.user?.populate<{ dictionaries: DictionaryMongooseHydrated[] }>('dictionaries')
    if (!ctx.session?.addWords?.word) {
      throw new Error('No word is set for the translation')
    }
    //@ts-ignore
    const { dictionary } = await ctx.user?.addWordToDictionary({
      value: ctx.session.addWords.word,
      translation: translation || '',
      dictId: ctx?.session?.activeDictionaryId,
    })

    ctx.session.state = 'addWord'

    return await ctx.reply(
      `A new pair ${ctx.session.addWords.word} - ${translation} has been added to ${dictionary.name}!\n\nContinue adding vocab`,
    )
  }

  return await next()
}

export default addWords
