import { SessionFlavor } from 'grammy'

export type SessionData = {
  activeDictionaryId?: string | null
}

export type MySession = SessionFlavor<SessionData>
