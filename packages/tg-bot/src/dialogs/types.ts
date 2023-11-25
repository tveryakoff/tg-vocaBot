import { AppState } from '../context/session'

export enum ADD_WORDS_STAGE {
  DEFAULT = 'default',
  WORD = 'word',
  TRANSLATION = 'translation',
}

export enum TRAIN_WORDS_STAGE {
  DEFAULT = 'default',
  GET_WORD = 'getWord',
  SELECT_TRAINING_TYPE = 'selectTrainingType',
  CHECK_WORD = 'checkWord',
}

export type DEFAULT_STATE = {
  stage?: string
}

export type ADD_WORDS_STATE = {
  stage: ADD_WORDS_STAGE
  word?: string
}

export type TRAIN_WORDS_STATE = {
  stage: TRAIN_WORDS_STAGE
  type: 'word' | 'translation'
  word?: string
}
