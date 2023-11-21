import { Bot, session } from 'grammy'
import { Menu } from '@grammyjs/menu'

import dotenv from 'dotenv'
import http from './http'
import { addOrLearnMenu } from './menus/trainOrLearn'
import { getUserData } from './auth/userData'
import { dictionaryResolver } from '../../../services/db/resolvers/dictionary'
import { Dictionary } from '../../../types/user'
import connectMongoDb from '../../../services/db/connect'
import { conversations, createConversation } from '@grammyjs/conversations'
import { addWord } from './conversations/addWord'
import { CONVERSATION } from './constants/conversation'
import { MyContextType } from './types/context'
import mongoose from 'mongoose'
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb'
import { SessionData } from './types/session'

dotenv.config()

async function bootstrap() {
  const collection = mongoose.connection.db.collection<ISession>('sessions')
  const dictSelectMenu = new Menu('dictSelect')

  const bot = new Bot<MyContextType>(`${process.env.API_KEY_BOT}`)

  await bot.api.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'addwords', description: 'Add words' },
  ])

  bot.use(getUserData)

  // Install the session plugin.
  bot.use(
    session({
      initial: () => ({
        activeDictionaryId: null,
      }),
      storage: new MongoDBAdapter<SessionData>({ collection }),
    }),
  )

  bot.use(conversations())
  bot.use(createConversation(addWord, CONVERSATION.ADD_WORD))
  bot.use(addOrLearnMenu, dictSelectMenu)

  bot.command('start', async (ctx) => {
    if (!ctx.user) {
      throw new Error(`user with ${ctx.from?.id} doesn't exist`)
    }
    await ctx.user.populate('dictionaries')

    const dictionaries = ctx.user.dictionaries as Dictionary[]

    try {
      if (!dictionaries?.length) {
        const dict = await dictionaryResolver.createDictionary(ctx.user, { name: 'My first dictionary', words: [] })
        await ctx.reply(
          `Welcome ${ctx?.from?.username}! \nI've just created your first dictionary, go ahead and add some vocab in it!`,
        )
        ctx.session.activeDictionaryId = dict.id
        await ctx.conversation.enter(CONVERSATION.ADD_WORD)
      }
      if (dictionaries.length === 1) {
        console.log('ctx.session.activeDictionaryId', dictionaries)
        //@ts-ignore
        ctx.session.activeDictionaryId = dictionaries[0]?._id.toString() as string
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

  bot.command('addwords', async (ctx) => {
    return await ctx.conversation.enter(CONVERSATION.ADD_WORD)
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

  return bot.start()
}

const { DB_CONNECTION_URI, DB_NAME } = process.env

connectMongoDb(DB_CONNECTION_URI, DB_NAME)
  .then(() => {
    console.log(`Connected to DB, starting the bot...`)
    return bootstrap()
  })
  .catch((e) => {
    console.log('Error while connecting to DB', e)
  })
