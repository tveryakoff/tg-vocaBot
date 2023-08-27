import express from 'express'
import UserModel from '../models/user'
import bcrypt from 'bcrypt'
import { generateAuthJwtToken } from '../utils/auth'

const router = express.Router()

router.route('/tg').post(async (req, res) => {
  const { user, key } = req.body
  if ((!user && !key) || key !== process.env.API_KEY_BOT) {
    res.status(401).json({ message: 'No user' })
  }

  if (user) {
    const result = await bcrypt.compare(user.id, user.tgIdHash)
    if (result) {
      return res.status(200).json({ user })
    }
  }

  try {
    const newUser = await new UserModel({
      tgIdHash: bcrypt.hash(req.body.id, 10),
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      userName: req.body.username,
    })

    await newUser.save()
    const jwtToken = generateAuthJwtToken(user, key)
    return res.status(200).json({ user: newUser, jwtToken })
  } catch (error) {
    console.log('error', error)
  }
})

export default router
