import { MyContextType } from '../types/context'
import { Middleware } from 'grammy'
import { AppState } from '../types/dialogs'

const trainWords: Middleware<MyContextType> = async (ctx, next) => {
  const state = ctx.session.state
  if (!state || state !== AppState.TRAIN_WORDS) {
    return await next()
  }

  return await ctx.reply(`Training words...`)
}

export default trainWords
