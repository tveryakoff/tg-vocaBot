import { Composer, Context, session } from 'grammy'
import { ConversationFlavor } from '@grammyjs/conversations'
import { UserMongooseHydrated } from '../../../../types/user'
import { AppState, MySession, SessionData } from './session'
import { getUserData } from '../auth/userData'
import { dialogsApi } from '../dialogs'
import { INITIAL_STATE } from './constants'
import { Collection } from 'mongoose'
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb'

export type ExtendedContext = Context & {
  user: UserMongooseHydrated | null
  dialog: {
    enter: (name: AppState, initialState?: any) => any
  }
}

export type MyContextType = ExtendedContext & ConversationFlavor & MySession

const composer = new Composer()

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
