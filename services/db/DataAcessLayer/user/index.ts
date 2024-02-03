import { UserDto, User as UserType, DictionaryDto } from '../../types'
import UserModel from '../../models/user'
import { HydratedDocument, Types } from 'mongoose'
import { Dictionary } from '../dictionary'

type Params = { newUserData?: UserDto; model?: HydratedDocument<UserDto> }

export class User {
  private readonly mongooseUserModel: HydratedDocument<UserType>

  constructor(params: Params) {
    if (params.model) {
      this.mongooseUserModel = params.model
    } else {
      this.mongooseUserModel = new UserModel(params.newUserData)
    }
  }

  get tgId() {
    return this.mongooseUserModel.tgId
  }

  get firstName() {
    return this.mongooseUserModel.firstName
  }

  get lastName() {
    return this.mongooseUserModel.lastName
  }

  get userName() {
    return this.mongooseUserModel.userName
  }

  get dictionaries() {
    return this.mongooseUserModel.dictionaries
  }

  async getPopulatedDictionaries(fields: Array<keyof DictionaryDto>) {
    if (this.mongooseUserModel.populated('dictionaries')) {
      return this.mongooseUserModel.dictionaries
    }

    await this.mongooseUserModel.populate('dictionaries', ...fields)
    return this.mongooseUserModel.dictionaries
  }

  get languageCode() {
    return this.mongooseUserModel.languageCode
  }

  static async checkIfExists(tgId: UserDto['tgId']) {
    return UserModel.exists({ tgId })
  }

  static async getUserByTgId(tgId: UserDto['tgId']) {
    return UserModel.findOne({ tgId })
  }

  public async save() {
    await this.mongooseUserModel.save()
  }

  public async createDictionary(dictionaryInput: DictionaryDto) {
    await this.mongooseUserModel.populate('dictionaries', ['name'])
    if (
      this.mongooseUserModel.dictionaries.find(
        //@ts-ignore
        (d) => d.name.trim().toLowerCase() === dictionaryInput.name.trim().toLowerCase(),
      )
    ) {
      this.mongooseUserModel.depopulate('dictionaries')
      return {
        error: {
          message: `Dictionary with that name already exists`,
        },
      }
    }
    const dict = new Dictionary({ dictData: dictionaryInput })
    await dict.save()
    this.mongooseUserModel.dictionaries.push(new Types.ObjectId(dict._id))
    await this.mongooseUserModel.save()
    return {
      dictionary: dict,
      error: null,
    }
  }

  public async deleteDictionary(dictId) {
    if (this.mongooseUserModel.dictionaries?.length && this.mongooseUserModel.dictionaries.length <= 1) {
      return `You can't delete all your dictionaries`
    }

    await Dictionary.deleteDictionary(dictId)
    this.mongooseUserModel.dictionaries = this.mongooseUserModel.dictionaries.filter(
      (doc) => doc._id?.toString() !== dictId.toString(),
    )
    await this.mongooseUserModel.save()
    return this
  }
}
