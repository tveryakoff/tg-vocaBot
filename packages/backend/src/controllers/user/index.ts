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

router.route('/add-word').post(async (req, res) => {
  const user = await UserModel.findOne({ tgId: req.body.id })
  if (!user) {
    throw new Error('No user')
  }
  await user.addWordToDictionary({ value: 'Hello', translation: 'привет' })

  return res.send(`word has been added Hello - привет`)
})

export default router
