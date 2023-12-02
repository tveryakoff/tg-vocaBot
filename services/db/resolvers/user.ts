import User from '../models/user'
import { DictionaryMongooseHydrated, User as UserType, UserMongooseHydrated } from '../../../types/user'

export const userResolver = {
  createUser: async function (userInput: UserType) {
    const newUser = await new User(userInput)
    return newUser
  },

  createIfNotExist: async function (
    userInput: UserType,
    dictId?: string,
  ): Promise<{
    user: UserMongooseHydrated
    activeDictionary: DictionaryMongooseHydrated
  }> {
    const user = await User.findOne({ tgId: userInput.tgId })
    if (user) {
      await user.populate<DictionaryMongooseHydrated[]>('dictionaries')

      let dictList: DictionaryMongooseHydrated[] = []
      if (dictId) {
        dictList = user.dictionaries as DictionaryMongooseHydrated[]
      }
      return {
        user,
        activeDictionary: dictList?.length ? dictList?.find((d) => d?._id.toString() === dictId) : null,
      }
    } else {
      const newUser = await this.createUser(userInput)
      return {
        user: newUser,
        activeDictionary: null,
      }
    }
  },

  getById: async function (id: string): Promise<UserMongooseHydrated | null> {
    return User.findById(id)
  },

  getByTgId: async function (tgId?: number): Promise<UserMongooseHydrated | null> {
    return User.findOne({ tgId })
  },
}
