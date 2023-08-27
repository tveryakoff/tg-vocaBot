import express from 'express'
import UserModel from '../../models/user'
import { generateAuthJwtToken } from '../../utils/auth'
import User from "../../models/user";
const router = express.Router()

router.route('/tg').post(async (req, res) => {
  const { user: reqUser, key } = req.body
  if ((!reqUser && !key) || key !== process.env.API_KEY_BOT) {
    return res.status(401).json({ message: 'No user' })
  }

  const user = await User.findOne({tgId: reqUser.id})
  if (user) {
    const jwtToken = generateAuthJwtToken(user, key)
    return res.status(200).json({ user: user, jwtToken })
  }

  if (!user) {
    try {
      const newUser =  await new UserModel({
        tgId: reqUser.id,
        firstName: reqUser.first_name,
        lastName: reqUser.last_name,
        userName: reqUser.username,
      })

      await newUser.save()
      const jwtToken = generateAuthJwtToken(newUser, key)
      return res.status(200).json({ user: newUser, jwtToken })
    } catch (error) {
      console.log('error', error)
    }
  }
})

export default router
