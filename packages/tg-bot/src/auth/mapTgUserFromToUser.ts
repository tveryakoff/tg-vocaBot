import { Context } from 'grammy'
import { User } from '../../../../types/user'

export const mapTgUserFromToUser = (userInput: Context['from']): User => ({
  userName: userInput?.username,
  firstName: userInput?.first_name,
  lastName: userInput.last_name,
  tgId: userInput.id,
  languageCode: userInput?.language_code,
  dictionaries: [],
})
