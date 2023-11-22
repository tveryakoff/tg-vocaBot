import { Context, NextFunction } from 'grammy'
import { ConversationFlavor } from '@grammyjs/conversations'
import { UserMongooseHydrated } from '../../../../types/user'
import { MySession } from './session'
import { DialogName } from './dialogs'

export type ExtendedContext = Context & {
  user: UserMongooseHydrated | null
  dialog: {
    enter: (name: DialogName, next?: NextFunction) => any
  }
}

export type MyContextType = ExtendedContext & ConversationFlavor & MySession
