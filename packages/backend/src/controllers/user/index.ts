import express from 'express'
import UserModel from '../../models/user'

const router = express.Router()

router.route('/add-word').post(async (req, res) => {
  const user = await UserModel.findOne({ tgId: req.body.id })
  if (!user) {
    throw new Error('No user')
  }
  await user.addWordToDictionary({ value: 'Hello', translation: 'привет' })

  return res.send(`word has been added Hello - привет`)
})

export default router
