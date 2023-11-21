import { userResolver } from '../../../../services/db/resolvers/user'
import { Middleware } from 'grammy'
import { MyContextType } from '../types/context'

export const getUserData: Middleware<MyContextType> = async (ctx, next) => {
  if (!ctx) {
    return await next()
  }

  if (!ctx?.user && ctx.from?.id) {
    //@ts-ignore
    ctx.user = await userResolver.createIfNotExist({
      userName: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
      tgId: ctx.from.id,
      languageCode: ctx.from?.language_code,
      dictionaries: [],
    })
  }

  return await next()
}
