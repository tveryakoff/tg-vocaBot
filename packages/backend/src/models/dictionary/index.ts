import mongoose from 'mongoose'
import { WORD_MODEL_NAME } from '../word'
const { Schema } = mongoose

export const DICTIONARY_MODEL_NAME = 'Dictionary'

export const dictionarySchema = new Schema({
  name: { type: String },
  targetLanguage: { type: String },
  translationLanguage: { type: String },
  words: [
    {
      type: Schema.Types.ObjectId,
      ref: WORD_MODEL_NAME,
    },
  ],
})

const DictionaryModel = mongoose.model(DICTIONARY_MODEL_NAME, dictionarySchema)

export default DictionaryModel
