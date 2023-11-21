import { Context } from 'grammy'
import { ConversationFlavor } from '@grammyjs/conversations'
import { UserMongooseHydrated } from '../../../../types/user'
import { MySession } from './session'

export type ExtendedContext = Context & {
  user: UserMongooseHydrated | null
}

export type MyContextType = ExtendedContext & ConversationFlavor & MySession
