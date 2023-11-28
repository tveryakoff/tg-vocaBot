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
      hasWordInDictionary: async function (dictId, word) {
        const populatedUser = await this.populate<{ dictionaries: DictionaryMongooseHydrated[] }>({
          path: 'dictionaries',
          match: { _id: { $eq: dictId } },
        })

        const dict = populatedUser.dictionaries?.[0]

        if (!dict) {
          throw new Error(`No dictionary with ${dictId} found`)
        }
        const value = word.trim().toLowerCase()

        if (dict.words?.find((w) => w?.value === value)) {
          return true
        }

        return false
      },
      getWordForTraining: async function (dictId) {
        const populatedUser = await this.populate<{ dictionaries: DictionaryMongooseHydrated[] }>({
          path: 'dictionaries',
          match: { _id: { $eq: dictId } },
        })

        const dict = populatedUser.dictionaries?.[0]

        if (!dict) {
          throw new Error(`No dictionary with ${dictId} found`)
        }

        return dict.getWordForTraining()
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

        const dict = populatedUser.dictionaries?.[0]

        if (!dict) {
          throw new Error(`No dictionary with ${dictId} found`)
        }

        const value = valueRaw.trim().toLowerCase()
        const translation = translationRaw.trim().toLowerCase()

        if (dict.words?.find((w) => w?.value === value)) {
          return {
            user: this,
            dictionary: dict,
            justAdded: {
              value,
              translation,
            },
          }
        }
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
      checkWord: async function (userInput) {
        const dict: DictionaryMongooseHydrated = await Dictionary.findById(userInput.dictId)
        if (!dict) {
          throw new Error(`Dictionary with ${userInput.dictId} not found while checking a word`)
        }
        return dict.checkWord(userInput)
      },
      getDictWords: async function (userInput) {
        const perPage = 5
        const { page, dictId } = userInput
        const dict: DictionaryMongooseHydrated = await Dictionary.findById(dictId)
        if (!dict) {
          throw new Error(`Dictionary with ${dictId} not found while checking a word`)
        }
        if (!dict?.words?.length) {
          return { words: [], total: 0 }
        }
        const end = (page + 1) * perPage <= dict.words.length ? (page + 1) * perPage : dict.words.length
        return { words: dict.words.slice(page * perPage, end), total: Math.ceil(dict.words.length / perPage) || 0 }
      },
      deleteWord: async function (dictId, wordValue) {
        const dict: DictionaryMongooseHydrated = await Dictionary.findById(dictId)
        if (!dict) {
          throw new Error(`Dictionary with ${dictId} not found while checking a word`)
        }
        if (!dict?.words?.length) {
          return false
        }
        dict.words = dict.words.filter((w) => w.value !== wordValue)
        await dict.save()
        return true
      },
    },
  },
)

const userModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default userModel
