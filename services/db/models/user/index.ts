import mongoose, { Schema } from 'mongoose'
import { DICTIONARY_MODEL_NAME } from '../dictionary'
import { User } from '../../types'

const USER_MODEL_NAME = 'User'

const userSchema = new Schema<User>({
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
})

const userModel = mongoose.model<User>(USER_MODEL_NAME, userSchema)

export default userModel
