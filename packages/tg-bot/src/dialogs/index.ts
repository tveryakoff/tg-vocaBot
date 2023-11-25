import { Middleware, MiddlewareFn } from 'grammy'
import addWord from './addWord'
import trainWords from './trainWords'
import { MyContextType } from '../context'
import { AppState, DIALOG_STATE } from '../context/session'
import { INITIAL_DIALOG_STATE } from './constants'

const dialogsObj: { [name in AppState]: Middleware<MyContextType> } = {
  [AppState.ADD_WORDS]: addWord,
  [AppState.TRAIN_WORDS]: trainWords,
  [AppState.DEFAULT]: () => null,
}

export const dialogsApi: Middleware<MyContextType> = async (ctx, next) => {
  ctx.dialog = {
    enter: async <T extends AppState>(name: T, initialState: DIALOG_STATE[T]) => {
      ctx.session.state = name

      if (!initialState) {
        ctx.session[name] = { ...INITIAL_DIALOG_STATE[name] }
      } else {
        ctx.session[name] = { ...initialState }
      }

      const start = dialogsObj[name] as MiddlewareFn<MyContextType>

      return start(ctx, next)
    },
  }

  return await next()
}

const dialogs: Middleware<MyContextType>[] = [addWord, trainWords]

export default dialogs
