import mongoose from 'mongoose'
const { Schema } = mongoose

const USER_MODEL_NAME = 'User'

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
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
  languagePair: [
    {
      target: String,
      translation: String,
    },
  ],
})

const userModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default userModel
