export type DEFAULT_STATE = {
  stage?: string
}

export enum ADD_WORDS_STAGE {
  DEFAULT = 'default',
  WORD = 'word',
  TRANSLATION = 'translation',
}

export type ADD_WORDS_STATE = {
  stage: ADD_WORDS_STAGE
  word?: string
}

export enum TRAIN_WORDS_STAGE {
  DEFAULT = 'default',
  GET_WORD = 'getWord',
  SELECT_TRAINING_TYPE = 'selectTrainingType',
  CHECK_WORD = 'checkWord',
}

export type TRAIN_WORDS_STATE = {
  stage: TRAIN_WORDS_STAGE
  type: 'word' | 'translation'
  word?: string
}

export enum EDIT_WORDS_STAGE {
  DEFAULT = 'default',
  CHOOSE_WORD = 'chooseWord',
  WORD_EDIT = 'wordEdit',
}

export type EDIT_WORDS_STATE = {
  stage: EDIT_WORDS_STAGE
  word?: string
  page?: number
  total?: number
}
