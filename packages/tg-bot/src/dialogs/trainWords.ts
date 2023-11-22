import { MyContextType } from '../types/context'
import { Middleware } from 'grammy'

const trainWords: Middleware<MyContextType> = async (ctx, next) => {
  const state = ctx.session.state
  if (!state || state !== 'trainWords') {
    return await next()
  }

  if (state === 'trainWords') {
    if (!ctx?.message?.text) {
      return await ctx.reply(`Word can't be empty!`)
    }
    return await ctx.reply(`Training words...`)
  }
}

export default trainWords
