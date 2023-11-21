import { UserMongooseHydrated } from '../../../types/user'
import { Api, Context } from 'grammy'
import type { Update, UserFromGetMe } from 'grammy/types'

export default class MyContext extends Context {
  public user: UserMongooseHydrated | null
  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me)
    this.user = null
  }
}
