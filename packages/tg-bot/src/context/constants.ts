import { AppState, SessionData } from './session'

export const INITIAL_STATE: SessionData = {
  state: AppState.DEFAULT,
  activeDictionaryId: null,
  [AppState.ADD_WORDS]: {
    stage: null,
    word: null,
  },
  [AppState.TRAIN_WORDS]: {
    stage: null,
    type: 'word',
    word: null,
  },
  [AppState.DEFAULT]: {
    stage: null,
  },
}
