import User from '../models/user'
import { User as UserType, UserMongooseHydrated } from '../../../types/user'

export const userResolver = {
  createUser: async function (userInput: UserType) {
    const newUser = await new User(userInput)
    return newUser
  },

  createIfNotExist: async function (userInput: UserType) {
    const user = await User.findOne({ tgId: userInput.tgId })
    if (user) {
      return user
    } else return await this.createUser(userInput)
  },

  getById: async function (id: string): Promise<UserMongooseHydrated | null> {
    return User.findById(id)
  },

  getByTgId: async function (tgId: number): Promise<UserMongooseHydrated | null> {
    return User.findOne({ tgId })
  },
}
