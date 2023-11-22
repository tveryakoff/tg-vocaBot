import mongoose, { Schema } from 'mongoose'
import Dictionary, { DICTIONARY_MODEL_NAME } from '../dictionary'
import { DictionaryMongooseHydrated, User, UserMethods } from '../../../../types/user'

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
      addWordToDictionary: async function ({
        value: valueRaw,
        translation: translationRaw,
        transcription,
        mark,
        dictId,
      }) {
        const populatedUser = await this.populate<{ dictionaries: DictionaryMongooseHydrated[] }>({
          path: 'dictionaries',
          match: { _id: { $eq: dictId } },
        })
        const value = valueRaw.trim().toLowerCase()
        const translation = translationRaw.trim().toLowerCase()

        const dict = populatedUser.dictionaries[0]
        dict.words.push({
          value,
          translation,
          transcription,
          mark,
        })
        await dict.save()
        await this.save()
        return {
          user: this,
          dictionary: dict,
          justAdded: {
            value,
            translation,
          },
        }
      },
    },
  },
)

const userModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default userModel