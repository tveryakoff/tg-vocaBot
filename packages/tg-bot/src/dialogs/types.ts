import { WordMongooseHydrated } from '../../../../types/user'

export type DialogName = 'addWords' | 'studyWords' | 'editWords' | 'start' | 'addDictionary' | 'selectActiveDictionary'

export type DIALOG_STATE = {
  addWords: ADD_WORDS_STATE
  studyWords: TRAIN_WORDS_STATE
  editWords: EDIT_WORDS_STATE
  addDictionary: ADD_DICTIONARY_STATE
  start?: null
  selectActiveDictionary: null
}

export enum ADD_DICTIONARY_STAGE {
  DEFAULT = 'default',
  NAME = 'name',
}

export type ADD_DICTIONARY_STATE = {
  stage: ADD_DICTIONARY_STAGE
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
  type?: 'word' | 'translation'
  word?: string
}

export enum EDIT_WORDS_STAGE {
  DEFAULT = 'default',
  CHOOSE_WORD = 'chooseWord',
  WORD_EDIT_START = 'wordEditStart',
  WORD_EDIT_END = 'wordEditEnd',
  TRANSLATION_EDIT_START = 'translationEditStart',
  TRANSLATION_EDIT_END = 'translationEditEnd',
}

export type EDIT_WORDS_STATE = {
  word?: WordMongooseHydrated
  stage: EDIT_WORDS_STAGE
  page?: number
  total?: number
}
