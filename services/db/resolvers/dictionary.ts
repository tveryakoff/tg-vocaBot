import { UserMongooseHydrated, Dictionary } from '../../../types/user'

export const dictionaryResolver = {
  createDictionary: async (user: UserMongooseHydrated, dictionaryInput: Dictionary) => {
    if (!user) {
      throw new Error('User doesnt exits')
    }
    const dict = await user.createDictionary(dictionaryInput)
    return dict
  },
  getUserDictionaryList: async (user: UserMongooseHydrated) => {
    if (!user) {
      throw new Error('User doesnt exits')
    }

    return user.populate('dictionaries')
  },
}
