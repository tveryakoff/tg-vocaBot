import express from 'express'
import UserModel from '../../models/user'

const router = express.Router()

router.route('/').post(async (req, res) => {
  const user = await UserModel.findOne({ tgId: req.body.id })
  if (user) {
    return res.status(200).json({ user })
  }

  try {
    const newUser = await new UserModel({
      tgId: req.body.id,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      userName: req.body.username,
    })

    await newUser.save()
    return res.status(200).json({ user: newUser })
  } catch (error) {
    console.log('error', error)
  }
})

export default router
