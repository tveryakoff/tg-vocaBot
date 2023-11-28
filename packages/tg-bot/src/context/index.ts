import { Composer, Context, MiddlewareFn, session } from 'grammy'
import { ConversationFlavor } from '@grammyjs/conversations'
import { UserMongooseHydrated } from '../../../../types/user'
import { AppState, MySession, SessionData } from './session'
import { getUserData } from '../auth/userData'
import { dialogsApi } from '../dialogs'
import { INITIAL_STATE } from './constants'
import { Collection } from 'mongoose'
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb'
import { INITIAL_DIALOG_STATE } from '../dialogs/constants'

export type ExtendedContext = Context & {
  user: UserMongooseHydrated | null
  dialog: {
    enter: (name: AppState, initialState?: any) => any
  }
}

export type MyContextType = ExtendedContext & ConversationFlavor & MySession

const composer = new Composer()

export const clearSessionData: MiddlewareFn<MyContextType> = async (ctx, next) => {
  ctx.session = { ...ctx.session, ...INITIAL_DIALOG_STATE }
  ctx.session.state = AppState.DEFAULT

  return await next()
}

const contextComposer = (collection: Collection<ISession>) =>
  composer.use(
    session({
      initial: () => ({ ...INITIAL_STATE }),
      storage: new MongoDBAdapter<SessionData>({ collection }),
    }),
    getUserData,
    dialogsApi,
  )
export { contextComposer }
