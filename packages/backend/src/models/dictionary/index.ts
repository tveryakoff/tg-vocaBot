import mongoose from 'mongoose'
import { wordSchema } from '../word'
const { Schema } = mongoose

export const DICTIONARY_MODEL_NAME = 'Dictionary'

export const dictionarySchema = new Schema(
  {
    name: { type: String, default: 'English words dictionary' },
    targetLanguage: { type: String, default: 'English' },
    translationLanguage: { type: String, default: 'Russian' },
    words: [
      {
        type: wordSchema,
        default: [],
      },
    ],
  },
  {
    methods: {
      addWordToDictionary: async function (wordData) {
        this.words.push(wordData)
        this.save()
      },
    },
  },
)

const DictionaryModel = mongoose.model(DICTIONARY_MODEL_NAME, dictionarySchema)

export default DictionaryModel
