import { Context } from 'grammy'
import { UserDto } from '../../../../services/db/types'

export const mapTgUserFromToUser = (userInput: Context['from']): UserDto => ({
  userName: userInput?.username,
  firstName: userInput?.first_name,
  lastName: userInput.last_name,
  tgId: userInput.id,
  languageCode: userInput?.language_code,
  dictionaries: [],
})
