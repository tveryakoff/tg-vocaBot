import { Word } from '../../types/user'

export type UserDto = {
  userName: string
  firstName: string
  lastName: string
  tgId: string
  languageCode: string
  dictionaries: string[]
}

export type Word = {
  value: string
  translation: string
  context?: string
  transcription?: string
  lastTrained?: string
  createdAt?: string
  mark?: 1 | 2 | 3
}

export type DictionaryDto = {
  _id?: string
  name: string
  targetLanguage?: string
  translationLanguage?: string
  words: Array<Word>
}
