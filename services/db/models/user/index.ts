import mongoose, { Schema } from 'mongoose'
import Dictionary, { DICTIONARY_MODEL_NAME } from '../dictionary'
import { DictionaryMongooseHydrated, User, User as UserType, UserMethods } from '../../../../types/user'

const USER_MODEL_NAME = 'User'

const userSchema = new Schema<User, unknown, UserMethods>(
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
      addWordToDictionary: async function (wordData, dictId) {
        const populatedUser = await this.populate({ path: 'dictionaries', match: { _id: { $eq: dictId } } })
        console.log('dics', populatedUser.dictionaries)
        //@ts-ignore
        const dict = populatedUser.dictionaries[0]
        //@ts-ignore
        dict.words.push({ value: wordData.value, translation: wordData.translation })
        //@ts-ignore
        await dict.save()
        await this.save()
      },
    },
  },
)

const userModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default userModel
