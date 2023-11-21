import mongoose from 'mongoose'
import { wordSchema } from '../word'
import { Dictionary } from '../../../../types/user'
const { Schema } = mongoose

export const DICTIONARY_MODEL_NAME = 'Dictionary'

export const dictionarySchema = new Schema<Dictionary>({
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
