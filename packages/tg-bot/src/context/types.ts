import { SessionFlavor } from 'grammy'
import { DIALOG_STATE, DialogName } from '../dialogs/types'

export type SessionData = DIALOG_STATE & {
  activeDictionaryId?: string | null
  activeDialogName?: DialogName
}

export type MySession = SessionFlavor<SessionData>
