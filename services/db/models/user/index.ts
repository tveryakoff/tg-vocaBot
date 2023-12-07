import mongoose, { Schema } from 'mongoose'
import Dictionary, { DICTIONARY_MODEL_NAME } from '../dictionary'
import { DictionaryMongooseHydrated, User, UserMethods, UserModel, WordMongooseHydrated } from '../../../../types/user'

const USER_MODEL_NAME = 'User'

const userSchema = new Schema<User & UserMethods, UserModel>(
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
        this.dictionaries.push(dict.id)
        await this.save()
        return dict
      },

      getDictionary: async function (dictId) {
        if (this.dictionaries.indexOf(dictId) === -1) {
          return null
        }

        const dict = await Dictionary.findById(dictId)
        return dict
      },
    },
  },
)

userSchema.static('createIfNotExits', async function (userInput, dictId) {
  const user = await this.findOne({ tgId: userInput.tgId })
  if (user) {
    return user
  } else {
    const newUser = new this(userInput)
    await newUser.save()
    return newUser
  }
})

const userModel = mongoose.model<User, UserModel>(USER_MODEL_NAME, userSchema)

export default userModel
