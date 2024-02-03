import { UserDto } from '../types'
import { User } from './user'
import { Dictionary } from './dictionary'

export * from './user'
export * from './dictionary'

export default class DbAccessLayer {
  static async createUserIfNotExists(userInput: UserDto) {
    const model = await User.getUserByTgId(userInput.tgId)

    if (model?._id) {
      return new User({ model })
    } else {
      const newUser = new User({ newUserData: userInput })
      await newUser.save()
      return newUser
    }
  }

  static async getDictionary(_id) {
    const model = await Dictionary.getDictionary(_id)

    if (model) {
      return new Dictionary({ model })
    }

    return null
  }
}
