import { MyContextType } from '../types/context'
import { Middleware, MiddlewareFn } from 'grammy'
import addWord from './addWord'
import trainWords from './trainWords'
import { AppState } from '../types/dialogs'

const dialogsObj: { [name in AppState]: Middleware<MyContextType> } = {
  [AppState.ADD_WORDS]: addWord,
  [AppState.TRAIN_WORDS]: trainWords,
  [AppState.DEFAULT]: () => null,
}

export const dialogsApi: Middleware<MyContextType> = async (ctx, next) => {
  ctx.dialog = {
    enter: async (name: AppState) => {
      ctx.session.state = name

      if (!ctx.session?.[name] && name) {
        ctx.session[name] = {
          stage: null,
        }
      } else {
        ctx.session[name].stage = null
      }

      const start = dialogsObj[name] as MiddlewareFn<MyContextType>

      return start(ctx, next)
    },
  }

  return await next()
}

const dialogs: Middleware<MyContextType>[] = [addWord, trainWords]

export default dialogs
