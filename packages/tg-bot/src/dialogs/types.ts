import { WordMongooseHydrated } from '../../../../types/user'

export type DialogName =
  | 'addWords'
  | 'studyWords'
  | 'editWords'
  | 'start'
  | 'addDictionary'
  | 'selectActiveDictionary'
  | 'manageDictionary'

export type DIALOG_STATE = Partial<{
  start: null
  addWords: ADD_WORDS_STATE
  studyWords: TRAIN_WORDS_STATE
  editWords: EDIT_WORDS_STATE
  addDictionary: ADD_DICTIONARY_STATE
  selectActiveDictionary: null
  manageDictionary: MANAGE_DICTIONARY_STATE
}>

export type MANAGE_DICTIONARY_STATE = Partial<{
  stage: MANAGE_DICTIONARY_STAGE
  editDictId: string
  page: number
  total: number
  word: WordMongooseHydrated
}>

export enum MANAGE_DICTIONARY_STAGE {
  DEFAULT = 'default',
  SELECT_DICT = 'selectDictionary',
  EDIT_DICT_WORDS = 'editDIctWords',
  EDIT_WORD_VALUE_START = 'editWordValueStart',
  EDIT_WORD_VALUE_FINISH = 'editWordValueFinish',
  EDIT_WORD_TRANSLATION_START = 'editWordTranslationStart',
  EDIT_WORD_TRANSLATION_FINISH = 'editWordTranslationFinish',
  DELETE_DICT = 'deleteDictionary',
  DELETE_DICT_CONFIRM = 'deleteDictionaryConfirm',
  CHANGE_NAME_START = 'changeNameStart',
  CHANGE_NAME_FINISH = 'changeNameFinish',
}

export enum ADD_DICTIONARY_STAGE {
  DEFAULT = 'default',
  NAME = 'name',
}

export type ADD_DICTIONARY_STATE = Partial<{
  stage: ADD_DICTIONARY_STAGE
}>

export enum ADD_WORDS_STAGE {
  DEFAULT = 'default',
  WORD = 'word',
  TRANSLATION = 'translation',
  CONTEXT = 'context',
}

export type ADD_WORDS_STATE = Partial<{
  stage: ADD_WORDS_STAGE
  word?: string
  translation?: string
  context?: string
  skipped?: boolean
}>

export enum TRAIN_WORDS_STAGE {
  DEFAULT = 'default',
  GET_WORD = 'getWord',
  SELECT_TRAINING_TYPE = 'selectTrainingType',
  CHECK_WORD = 'checkWord',
}

export type TRAIN_WORDS_STATE = Partial<{
  stage: TRAIN_WORDS_STAGE
  type?: 'word' | 'translation'
  word?: string
}>

export enum EDIT_WORDS_STAGE {
  DEFAULT = 'default',
  CHOOSE_WORD = 'chooseWord',
  WORD_EDIT_START = 'wordEditStart',
  WORD_EDIT_END = 'wordEditEnd',
  TRANSLATION_EDIT_START = 'translationEditStart',
  TRANSLATION_EDIT_END = 'translationEditEnd',
}

export type EDIT_WORDS_STATE = Partial<{
  word?: WordMongooseHydrated
  stage: EDIT_WORDS_STAGE
  page?: number
  total?: number
  deletingWordId?: string
}>
