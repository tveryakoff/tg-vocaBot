import mongoose, { Schema } from 'mongoose'
import Dictionary, { DICTIONARY_MODEL_NAME } from '../dictionary'

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
    tgId: {
      type: String,
      required: true,
    },
    languageCode: {
      type: String,
      default: 'ru',
    },
    dictionaries: [
      {
        type: Schema.Types.ObjectId,
        ref: DICTIONARY_MODEL_NAME,
      },
    ],
  },
  {
    methods: {
      createDictionary: async function (dictionaryInput) {
        const dict = new Dictionary(dictionaryInput)
        await dict.save()
        this.dictionaries.push(dict._id)
        await this.save()
        return this
      },
    },
  },
)

const userModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default userModel
