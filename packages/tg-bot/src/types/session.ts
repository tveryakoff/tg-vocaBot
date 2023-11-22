import { SessionFlavor } from 'grammy'
import { DialogName } from './dialogs'

export type SessionData = {
  activeDictionaryId?: string | null
  state?: DialogName
  addWords?: {
    word: string
  }
}

export type MySession = SessionFlavor<SessionData>
