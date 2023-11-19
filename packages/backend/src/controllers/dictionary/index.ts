import express from 'express'

const router = express.Router()

router
  .route('/dictionary')
  .post(async (req, res) => {
    const { user, body } = req
    if (!user) {
      return res.status(401).send('User not found')
    }
    const dict = await user.createDictionary({
      name: body.name,
      targetLanguage: body.targetLanguage,
      translationLanguage: body.translationLanguage,
      words: [],
    })

    return res.status(201).json({ dictionary: dict, message: `Dictionary ${dict.name} has been created` })
  })
  .get(async (req, res) => {
    const { user } = req
    await user.populate('dictionaries')

    return res.status(200).json({ dictionaries: user.dictionaries })
  })

router.route('/word').post(async (req, res) => {
  //@ts-ignore
  const user = req.user
  if (!user) {
    return res.status(401).send('User not found')
  }
  const reqWordsPair = req.body.wordsPair
  if (!reqWordsPair) {
    throw new Error('No words pair')
  }

  const word = reqWordsPair.word.trim().toLowerCase()
  const translation = reqWordsPair.translation.trim().toLowerCase()
  //@ts-ignore
  await user.addWordToDictionary({ value: word, translation: translation })

  return res.send(`Word has been added ${word} - ${reqWordsPair.translation}`)
})

export default router
