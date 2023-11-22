import { HydratedDocument, PopulatedDoc } from 'mongoose'

export type Word = {
  value: string
  translation: string
  transcription?: string
  lastTrained?: string
  createdAt?: string
  mark?: number
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

export type UserMethods = {
  createDictionary: (dictInput: Dictionary) => Promise<DictionaryMongooseHydrated>
  addWordToDictionary: (
    input: AddWordToDictInput,
  ) => Promise<{ user: UserMongooseHydrated; dictionary: DictionaryMongooseHydrated }>
}

export type WordMongooseHydrated = HydratedDocument<Word>
export type DictionaryMongooseHydrated = HydratedDocument<Dictionary>
export type UserMongooseHydrated = HydratedDocument<User, UserMethods>
