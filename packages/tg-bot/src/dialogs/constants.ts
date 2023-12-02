import { ADD_WORDS_STAGE, DIALOG_STATE, EDIT_WORDS_STAGE, TRAIN_WORDS_STAGE } from './types'

export const INITIAL_DIALOG_STATE: DIALOG_STATE = {
  addWords: {
    stage: ADD_WORDS_STAGE.DEFAULT,
    word: null,
  },
  studyWords: {
    stage: TRAIN_WORDS_STAGE.DEFAULT,
    word: null,
    type: 'word',
  },
  editWords: {
    stage: EDIT_WORDS_STAGE.DEFAULT,
    word: null,
    page: 0,
  },
}
