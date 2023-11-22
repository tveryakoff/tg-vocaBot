import { SessionFlavor } from 'grammy'
import { ADD_WORDS_STAGE, AppState } from './dialogs'

export type SessionData = {
  activeDictionaryId?: string | null
  state?: AppState
  [AppState.ADD_WORDS]: {
    word?: string
    stage: ADD_WORDS_STAGE | null
  }
  [AppState.TRAIN_WORDS]: {
    stage: string | null
  }
  [AppState.DEFAULT]: {
    stage: string | null
  }
}

export type MySession = SessionFlavor<SessionData>
