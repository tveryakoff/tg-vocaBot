import express from 'express'
import UserModel from '../../models/user'
import User from '../../models/user'
const router = express.Router()

router.route('/tg').post(async (req, res) => {
  const { user: userString } = req.headers
  const { id, userName, firstName, lastName, languageCode } = JSON.parse(userString as string)
  const user = await User.findOne({ tgId: id }).populate('dictionaries')
  if (user) {
    return res.status(200).json({ user, message: 'User already exists' })
  }

  if (!user) {
    try {
      const newUser = await new UserModel({
        tgId: id,
        firstName,
        lastName,
        userName,
        languageCode,
      })

      await newUser.save()
      return res.status(201).json({ user: newUser, message: 'New user has been created' })
    } catch (error) {
      console.log('error', error)
    }
  }
})

export default router
