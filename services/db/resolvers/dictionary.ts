import { UserMongooseHydrated, Dictionary } from '../../../types/user'

type AddWordParams = {
  dictId: string
  word: string
  translation: string
  user: UserMongooseHydrated
}

export const dictionaryResolver = {
  createDictionary: async (user: UserMongooseHydrated, dictionaryInput: Dictionary) => {
    if (!user) {
      throw new Error('User doesnt exits')
    }
    return await user.createDictionary(dictionaryInput)
  },
  getUserDictionaryList: async (user: UserMongooseHydrated) => {
    if (!user) {
      throw new Error('User doesnt exits')
    }

    return user.populate('dictionaries')
  },
  addWordToDictionary: async ({ dictId, word, translation, user }: AddWordParams) => {
    if (!dictId || !word || !translation) {
      throw new Error(`Error while adding ${word} - ${translation} to dictionary ${dictId}`)
    }
    const wordInput = {
      value: word,
      translation,
      mark: 0,
    }
  },
}
