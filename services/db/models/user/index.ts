import mongoose, { Schema } from 'mongoose'
import Dictionary, { DICTIONARY_MODEL_NAME } from '../dictionary'
import { DictionaryMongooseHydrated, User, UserMethods, UserModel, WordMongooseHydrated } from '../../../../types/user'
import { async } from 'rxjs'

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
        await this.populate('dictionaries', ['name'])
        if (
          this.dictionaries.find(
            (d: DictionaryMongooseHydrated) =>
              d.name.trim().toLowerCase() === dictionaryInput.name.trim().toLowerCase(),
          )
        ) {
          return {
            error: {
              message: `Dictionary with that name already exists`,
            },
          }
        }
        const dict = new Dictionary(dictionaryInput)
        await dict.save()
        this.dictionaries.push(dict.id)
        await this.save()
        return {
          dictionary: dict,
          error: null,
        }
      },

      getDictionary: async function (dictId) {
        if (this.dictionaries.indexOf(dictId) === -1) {
          return null
        }

        const dict = await Dictionary.findById(dictId)
        return dict
      },

      updateDictionary: async function (dictInput) {
        const { _id, ...rest } = dictInput
        await Dictionary.findByIdAndUpdate(_id.toString(), rest)
        this.save()
      },

      deleteDictionary: async function (dictId) {
        if (this.dictionaries?.length && this.dictionaries.length <= 1) {
          return `You can't delete all your dictionaries`
        }
        await Dictionary.findByIdAndDelete(dictId)
        this.dictionaries = (this.dictionaries as DictionaryMongooseHydrated[]).filter(
          (d) => d._id.toString() !== dictId,
        )
        await this.save()
        return this
      },
    },
  },
)

userSchema.static('createIfNotExits', async function (userInput) {
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
