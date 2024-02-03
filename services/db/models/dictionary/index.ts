import mongoose from 'mongoose'
import { wordSchema } from '../word'
import { DictionaryDto } from '../../types'
const { Schema } = mongoose

export const DICTIONARY_MODEL_NAME = 'Dictionary'

export const dictionarySchema = new Schema<DictionaryDto>({
  name: { type: String, default: 'English words dictionary' },
  targetLanguage: { type: String, default: 'English' },
  translationLanguage: { type: String, default: 'Russian' },
  words: [
    {
      type: wordSchema,
      default: [],
    },
  ],
})

const DictionaryModel = mongoose.model(DICTIONARY_MODEL_NAME, dictionarySchema)

export default DictionaryModel
