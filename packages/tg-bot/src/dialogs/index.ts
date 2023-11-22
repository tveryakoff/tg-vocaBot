import { MyContextType } from '../types/context'
import { Middleware, NextFunction } from 'grammy'
import { DialogName } from '../types/dialogs'
import addWord from './addWord'
import trainWords from './trainWords'

const dialogsObj = {
  addWordEnter: addWord,
  trainWords,
}

export const dialogsApi: Middleware<MyContextType> = async (ctx, next) => {
  ctx.dialog = {
    enter: async (name: DialogName, next?: NextFunction) => {
      ctx.session.state = name
      //@ts-ignore
      return dialogsObj[name](ctx)
    },
  }

  return await next()
}

const dialogs: Middleware<MyContextType>[] = [addWord, trainWords]

export default dialogs
