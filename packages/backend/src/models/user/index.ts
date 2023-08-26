import mongoose from 'mongoose'
const { Schema } = mongoose

const USER_MODEL_NAME = 'User'

const userSchema = new Schema({
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
  languagePair: {
    type: [
      {
        target: String,
        translation: String,
      },
    ],
    default: [
      {
        target: 'en',
        translation: 'rus',
      },
    ],
  },
})

const userModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default userModel
