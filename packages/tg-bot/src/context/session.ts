import { SessionFlavor } from 'grammy'
import { ADD_WORDS_STATE, DEFAULT_STATE, EDIT_WORDS_STATE, TRAIN_WORDS_STATE } from '../dialogs/types'

export type DIALOG_STATE = {
  [AppState.DEFAULT]: DEFAULT_STATE
  [AppState.ADD_WORDS]: ADD_WORDS_STATE
  [AppState.TRAIN_WORDS]: TRAIN_WORDS_STATE
  [AppState.EDIT_WORDS]: EDIT_WORDS_STATE
}

export enum AppState {
  DEFAULT = 'default',
  ADD_WORDS = 'addWords',
  TRAIN_WORDS = 'trainWords',
  EDIT_WORDS = 'editWords',
}

export type SessionData = DIALOG_STATE & {
  activeDictionaryId?: string | null
  state?: AppState
}

export type MySession = SessionFlavor<SessionData>
