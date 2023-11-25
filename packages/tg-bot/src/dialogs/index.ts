import { Middleware, MiddlewareFn } from 'grammy'
import addWord from './addWord'
import trainWords from './trainWords'
import {  MyContextType } from '../context'
import { AppState } from '../context/session'

const dialogsObj: { [name in AppState]: Middleware<MyContextType> } = {
  [AppState.ADD_WORDS]: addWord,
  [AppState.TRAIN_WORDS]: trainWords,
  [AppState.DEFAULT]: () => null,
}

export const dialogsApi: Middleware<MyContextType> = async (ctx, next) => {
  ctx.dialog = {
    enter: async (name: AppState, initialState: any) => {
      ctx.session.state = name

      if (!ctx.session?.[name] && name && !initialState) {
        ctx.session[name] = {
          //@ts-ignore
          stage: null,
        }
      } else if (!initialState) {
        ctx.session[name].stage = null
      } else {
        ctx.session[name] = initialState
      }

      const start = dialogsObj[name] as MiddlewareFn<MyContextType>

      return start(ctx, next)
    },
  }

  return await next()
}

const dialogs: Middleware<MyContextType>[] = [addWord, trainWords]

export default dialogs
