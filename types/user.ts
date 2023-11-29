import { HydratedDocument, PopulatedDoc } from 'mongoose'
import { W } from 'mongodb'

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
  dictionaries: PopulatedDoc<Dictionary & Document>[]
  languageCode?: string
}

export type AddWordToDictInput = Word & {
  dictId?: string | null
}

export type CheckWordInput = {
  dictId: string
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
  hasWordInDictionary: (dictId: string, word: string) => Promise<boolean>
  addWordToDictionary: (input: AddWordToDictInput) => Promise<{
    user: UserMongooseHydrated
    dictionary: DictionaryMongooseHydrated
    justAdded: { value: string | null; translation: string | null }
  }>
  getWordForTraining: (dictId?: string) => Promise<Word>
  checkWord: (input: CheckWordInput) => Promise<CheckWordResponse>
  getDictWords: (input: GetDictWordsInput) => Promise<{ words: WordMongooseHydrated[]; total: number }>
  deleteWord: (dictId: string, wordValue: string) => Promise<boolean>
  editWord: (input: EditWordInput) => Promise<Word>
}

export type DictionaryMethods = {
  getWordForTraining?: () => Promise<Word>
  checkWord?: (input: CheckWordInput) => Promise<CheckWordResponse>
  editWord?: (input: EditWordInput) => Promise<Word>
}

export type WordMongooseHydrated = HydratedDocument<Word> & { _doc: Word }
export type DictionaryMongooseHydrated = HydratedDocument<Dictionary, DictionaryMethods>
export type UserMongooseHydrated = HydratedDocument<User, UserMethods>
