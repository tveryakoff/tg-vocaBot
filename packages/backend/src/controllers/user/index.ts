import express from 'express'

const router = express.Router()

router.route('/add-word').post(async (req, res) => {
  //@ts-ignore
  const user = req.user;
  if (!user) {
    return res.status(401).send('User not found')
  }
  const reqWordsPair = req.body.wordsPair;
  if (!reqWordsPair) {
    throw new Error('No words pair')
  }

  const word = reqWordsPair.word.trim().toLowerCase();
  const translation = reqWordsPair.translation.trim().toLowerCase();
  //@ts-ignore
  await user.addWordToDictionary({ value: word, translation: translation })

  return res.send(`Word has been added ${word} - ${reqWordsPair.translation}`)
})

export default router
