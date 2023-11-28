import { AppState, SessionData } from './session'
import { EDIT_WORDS_STAGE } from '../dialogs/types'

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
  [AppState.EDIT_WORDS]: {
    stage: EDIT_WORDS_STAGE.DEFAULT,
    page: 0,
    word: null,
  },
}
