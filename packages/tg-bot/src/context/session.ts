import { ADD_DICTIONARY_STAGE, EDIT_WORDS_STAGE } from '../dialogs/types'
import { SessionData } from './types'

export const INITIAL_SESSION_STATE: SessionData = {
  activeDialogName: null,
  activeDictionaryId: null,
  addWords: {
    stage: null,
    word: null,
  },
  studyWords: {
    stage: null,
    type: 'word',
    word: null,
  },

  editWords: {
    stage: EDIT_WORDS_STAGE.DEFAULT,
    page: 0,
    word: null,
  },
  addDictionary: {
    stage: ADD_DICTIONARY_STAGE.DEFAULT,
  },
}
