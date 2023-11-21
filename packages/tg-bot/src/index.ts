import { Bot } from 'grammy'
import { Menu } from '@grammyjs/menu'

import dotenv from 'dotenv'
import http from './http'
import { addOrLearnMenu } from './menus/trainOrLearn'
import MyContext from './context'
import { getUserData } from './auth/userData'
import { dictionaryResolver } from '../../../services/db/resolvers/dictionary'
import { Dictionary } from '../../../types/user'
import connectMongoDb from '../../../services/db/connect'

dotenv.config()

const dictSelectMenu = new Menu('dictSelect')

const bot = new Bot(`${process.env.API_KEY_BOT}`, { ContextConstructor: MyContext })

bot.api.setMyCommands([{ command: 'start', description: 'Start the bot' }])

bot.use(addOrLearnMenu, dictSelectMenu, getUserData)

bot.command('start', async (ctx) => {
  if (!ctx.user) {
    throw new Error(`user with ${ctx.from?.id} doesn't exist`)
  }
  await ctx.user.populate('dictionaries')

  const dictionaries = ctx.user.dictionaries as Dictionary[]

  try {
    if (!dictionaries?.length) {
      await dictionaryResolver.createDictionary(ctx.user, { name: 'My first dictionary', words: [] })
      return ctx.reply(
        `Welcome ${ctx?.from?.username}! \nI've just created your first dictionary, go ahead and add some vocab in it!`,
        //TODO start add-word dialog
      )
    }
    if (dictionaries.length === 1) {
      return await ctx.reply(`Welcome ${ctx?.from?.username}! \n\nWhat are you up today?`, {
        reply_markup: addOrLearnMenu,
      })
    } else if (dictionaries.length > 1) {
      dictSelectMenu.row().dynamic((ctx, range) => {
        for (const dict of dictionaries) {
          range // no need for `new MenuRange()` or a `return`
            .text(dict?.name, (ctx) => ctx.reply(dict?._id || ''))
            .row()
        }
      })

      return await ctx.reply('Choose a dictionary to work with!', {
        reply_markup: dictSelectMenu,
      })
    }
  } catch (e) {
    console.log('error', e)
  }
})

bot.on('message', async (ctx) => {
  try {
    const user = ctx.from
    console.log(user)
    if (!user) {
      throw new Error('No user')
    }
    const pattern = new RegExp('^(.*?) - (.*)$')
    const message = ctx.update?.message?.text

    if (message && pattern.test(message)) {
      const wordsPair = pattern.exec(message)
      if (wordsPair) {
        const [, word, translation] = wordsPair
        const response = await http.post('user/add-word', {
          user: user,
          wordsPair: {
            word: word,
            translation: translation,
          },
        })
        ctx.reply(response?.data)
      }
    } else {
      ctx.reply(`${user.first_name} says ${message}!`)
    }
  } catch (e) {
    console.log('error', e)
  }
})

const { DB_CONNECTION_URI, DB_NAME } = process.env

connectMongoDb(DB_CONNECTION_URI, DB_NAME)
  .then(() => {
    console.log(`Connected to DB, starting the bot...`)
    bot.start()
  })
  .catch((e) => {
    console.log('Error while connecting to DB', e)
  })
//
// const words = [
//   { value: 'cat', count: 0 },
//   { value: 'dog', count: 0 },
//   { value: 'incentive', count: 0 },
//   { value: 'cocksucker', count: 0 },
//   { value: 'cunt', count: 0 },
//   { value: 'jerk', count: 0 },
//   { value: 'dick', count: 0 },
//   { value: 'pussy', count: 0 },
//   { value: 'lick', count: 0 },
// ]
//
// const shuffle = (array: Array<any>) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1))
//     ;[array[i], array[j]] = [array[j], array[i]]
//   }
//   return array
// }
//
// const train = () => {
//   const shuffledArray = shuffle(words)
//
//   console.log('SHUFFLED', shuffledArray, '\n')
//
//   const sorted = shuffledArray.sort((a, b) => {
//     if (a.count === b.count) {
//       return 0
//     } else if (a.count > b.count) {
//       return 1
//     }
//
//     return -1
//   })
//
//   console.log('Sorted', sorted, '\n')
//
//   console.log('training word', shuffledArray[0].value)
//
//   if (shuffledArray[0].count < 5) {
//     shuffledArray[0].count++
//   }

// INCORRECT ANSWER
// if (shuffledArray[0].count > 0) {
//   shuffledArray[0].count--
// }
// }
//
// train()
//
// train()
//
// train()
//
// train()
//
// train()
