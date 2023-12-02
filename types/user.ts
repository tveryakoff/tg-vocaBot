import { HydratedDocument, Model, PopulatedDoc } from 'mongoose'

export type Word = {
  value: string
  translation: string
  transcription?: string
  lastTrained?: string
  createdAt?: string
  mark?: 1 | 2 | 3
}

export type Dictionary = {
  _id?: string
  name: string
  targetLanguage?: string
  translationLanguage?: string
  words: Array<Word>
}

export type User = {
  tgId: string | number
  firstName?: string
  lastName?: string
  userName?: string
  dictionaries: PopulatedDoc<DictionaryMongooseHydrated>[]
  languageCode?: string
}

export interface UserModel extends Model<User> {
  createIfNotExits: (
    userInput: User,
    dictId: string,
  ) => Promise<{
    user: UserMongooseHydrated
    activeDictionary: DictionaryMongooseHydrated
  }>
}

export type AddWordToDictInput = Word & {
  dictId?: string | null
}

export type CheckWordInput = {
  word: string
  userInput: string
  type: 'word' | 'translation'
}

export type GetDictWordsInput = {
  dictId: string
  page: number
}

export type CheckWordResponse = { isCorrect: boolean; correctAnswer: string }

export type EditWordInput = Partial<WordMongooseHydrated> & { dictId: string }

export type UserMethods = {
  createDictionary: (dictInput: Dictionary) => Promise<DictionaryMongooseHydrated>
  getDictWords: (input: GetDictWordsInput) => Promise<{ words: WordMongooseHydrated[]; total: number }>
  deleteWord: (dictId: string, wordValue: string) => Promise<boolean>
  editWord: (input: EditWordInput) => Promise<Word>
}

export type DictionaryMethods = {
  hasWord?: (value: string, translation?: string) => Promise<string>
  addWord?: (input: AddWordToDictInput) => Promise<{
    justAdded?: { value: string | null; translation: string | null }
    message?: string
  }>
  getWordForTraining?: () => Promise<Word>
  checkWord?: (input: CheckWordInput) => Promise<CheckWordResponse>
  editWord?: (input: EditWordInput) => Promise<Word>
}

export type WordMongooseHydrated = HydratedDocument<Word> & { _doc: Word }
export type DictionaryMongooseHydrated = HydratedDocument<Dictionary, DictionaryMethods>
export type UserMongooseHydrated = HydratedDocument<User, UserMethods>
