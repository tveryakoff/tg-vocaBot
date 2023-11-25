import { AppState, DIALOG_STATE } from '../context/session'
import { ADD_WORDS_STAGE, TRAIN_WORDS_STAGE } from './types'

export const INITIAL_DIALOG_STATE: DIALOG_STATE = {
  [AppState.ADD_WORDS]: {
    stage: ADD_WORDS_STAGE.DEFAULT,
    word: null,
  },
  [AppState.TRAIN_WORDS]: {
    stage: TRAIN_WORDS_STAGE.DEFAULT,
    word: null,
    type: 'word',
  },
  [AppState.DEFAULT]: {
    stage: null,
  },
}
