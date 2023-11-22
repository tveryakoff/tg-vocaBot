import { Context, NextFunction } from 'grammy'
import { ConversationFlavor } from '@grammyjs/conversations'
import { UserMongooseHydrated } from '../../../../types/user'
import { MySession } from './session'
import { AppState } from './dialogs'

export type ExtendedContext = Context & {
  user: UserMongooseHydrated | null
  dialog: {
    enter: (name: AppState, next?: NextFunction) => any
  }
}

export type MyContextType = ExtendedContext & ConversationFlavor & MySession
