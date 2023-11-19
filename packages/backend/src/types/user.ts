import { Document } from 'mongoose'

export type Word = {
  value: string
  translation: string
  transcription?: string
}

export type Dictionary = {
  name: string
  targetLanguage?: string
  translationLanguage?: string
  words: Array<Word>
}

export type User = Document & {
  tgId: string
  firstName?: string
  lastName?: string
  userName?: string
  dictionaries?: Dictionary[]
  createDictionary: (dictInput: Dictionary) => Promise<Dictionary>
}

export type UserRequest = {
  id: string
  first_name?: string
  last_name?: string
  user_name?: string
}
