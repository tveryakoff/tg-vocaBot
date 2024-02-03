import { Types } from 'mongoose'

export type UserDto = {
  _id?: string
  tgId: string | number
  firstName?: string
  lastName?: string
  userName?: string
  dictionaries: Types.ObjectId[]
  languageCode?: string
}

export type User = Omit<UserDto, 'dictionaries'> & {
  dictionaries: Types.ObjectId[]
}

export type WordDto = {
  _id?: string
  value: string
  translation: string
  context?: string
  transcription?: string
  lastTrained?: string
  createdAt?: string
  mark?: 1 | 2 | 3
}

export type Word = WordDto & {
  _doc?: WordDto
}

export type DictionaryDto = {
  name: string
  targetLanguage?: string
  translationLanguage?: string
  words: Array<Word>
  _id?: string
}
