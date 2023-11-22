import { MyContextType } from '../types/context'
import { DictionaryMongooseHydrated } from '../../../../types/user'
import { Middleware } from 'grammy'
import { ADD_WORDS_STAGE, AppState } from '../types/dialogs'

const addWords: Middleware<MyContextType> = async (ctx, next) => {
  const state = ctx.session.state
  if (!state || state !== AppState.ADD_WORDS) {
    return await next()
  }

  const stage = ctx?.session?.addWords?.stage

  if (!stage || stage === ADD_WORDS_STAGE.DEFAULT) {
    ctx.session.addWords.stage = ADD_WORDS_STAGE.WORD
    return await ctx.reply(`Type in a word which you'd like to add:`)
  }

  if (stage === ADD_WORDS_STAGE.WORD) {
    if (!ctx?.message?.text) {
      return await ctx.reply(`Word can't be empty!`)
    }
    ctx.session.addWords = {
      stage: ADD_WORDS_STAGE.TRANSLATION,
      word: ctx.message?.text,
    }
    return await ctx.reply(`Type in a translation for ${ctx.message?.text}`)
  } else if (stage === ADD_WORDS_STAGE.TRANSLATION) {
    const translation = ctx.message?.text
    if (!translation) {
      return await ctx.reply(`Translation can't be empty!`)
    }
    ctx.user?.populate<{ dictionaries: DictionaryMongooseHydrated[] }>('dictionaries')
    if (!ctx.session?.addWords?.word) {
      throw new Error('No word is set for the translation')
    }
    const value = ctx.session.addWords.word
    //@ts-ignore
    const { dictionary, justAdded } = await ctx.user?.addWordToDictionary({
      value,
      translation: translation || '',
      dictId: ctx?.session?.activeDictionaryId,
    })

    ctx.session.addWords = {
      stage: ADD_WORDS_STAGE.WORD,
      //@ts-ignore
      word: null,
    }

    return await ctx.reply(
      `A new pair ${justAdded.value} - ${justAdded.translation} has been added to ${dictionary.name}!\n\nEnter a new word:`,
    )
  }

  return await next()
}

export default addWords
