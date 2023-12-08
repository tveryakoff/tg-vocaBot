import connectMongoDb from './connect'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import User from './models/user/index'
import Dictionary from './models/dictionary/index'

dotenv.config()

const { DB_CONNECTION_URI, DB_NAME } = process.env

const filePromise = fs.readFile('./words.json', 'utf8').then((data) => {
  return JSON.parse(data)
})

connectMongoDb(DB_CONNECTION_URI, DB_NAME).then(async (res) => {
  console.log('Connected to DB')
  const data = await filePromise
  console.log('words got loaded', data)
  const users = await User.find({ firstName: 'Dmitriy' })
  if (!users) {
    console.log('no users')
    return
  }

  const user = users[0]
  const dictionaryId = user.dictionaries[0]
  const dictionary = await Dictionary.findById(dictionaryId)
  if (!dictionary) {
    console.log('dictionary not found')
    return
  }

  dictionary.words = data['words']
  await dictionary.save()
  await user.save()

  console.log('Words have been saved!')
})
