import mongoose, { Schema } from 'mongoose'
import { dictionarySchema } from '../dictionary'
import WordModel from '../word'

const USER_MODEL_NAME = 'User'

const userSchema = new Schema(
  {
    userName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    tgIdHash: {
      type: String,
      required: true,
    },
    dictionary: {
      type: dictionarySchema,
      default: {
        targetLanguage: 'en',
        translationLanguage: 'ru',
        words: [],
      },
    },
  },
  {
    methods: {
      addWordToDictionary: async function (wordData) {
        const word = new WordModel(wordData)
        await word.save()
        //@ts-ignore
        this.dictionary.words.push(word._id)
        this.save()
      },
    },
  },
)

const userModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default userModel
