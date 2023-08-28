import express from 'express'
import UserModel from '../../models/user'

const router = express.Router()

router.route('/add-word').post(async (req, res) => {
  //@ts-ignore
  const reqUser = req.user;
  if (!reqUser) {
    return res.status(401).send('User not found')
  }
  const reqWordsPair = req.body.wordsPair;
  const user = await UserModel.findOne({ tgId: reqUser.tgId })
  if (!user) {
    throw new Error('No user')
  }
  if (!reqWordsPair) {
    throw new Error('No words pair')
  }

  const word = reqWordsPair.word.trim().toLowerCase();
  const translation = reqWordsPair.translation.trim().toLowerCase();
  await user.addWordToDictionary({ value: word, translation: translation })

  return res.send(`Word has been added ${word} - ${reqWordsPair.translation}`)
})

export default router
