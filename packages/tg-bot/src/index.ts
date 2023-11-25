import { Bot, session } from 'grammy'
import { Menu } from '@grammyjs/menu'

import dotenv from 'dotenv'
import { getUserData } from './auth/userData'
import { dictionaryResolver } from '../../../services/db/resolvers/dictionary'
import { Dictionary } from '../../../types/user'
import connectMongoDb from '../../../services/db/connect'
import { MyContextType } from './types/context'
import mongoose from 'mongoose'
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb'
import { SessionData } from './types/session'
import { addOrLearnMenu } from './menus/AddOrLearn'
import dialogs, { dialogsApi } from './dialogs'
import { AppState } from './types/dialogs'
import trainingTypeMenu from './menus/TrainingType'

dotenv.config()

async function bootstrap() {
  const collection = mongoose.connection.db.collection<ISession>('sessions')
  const dictSelectMenu = new Menu('dictSelect')

  const bot = new Bot<MyContextType>(`${process.env.API_KEY_BOT}`)

  await bot.api.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'addwords', description: 'Add words' },
    { command: 'trainwords', description: 'Train words' },
  ])

  bot.use(
    session({
      initial: () => ({
        activeDictionaryId: null,
        [AppState.ADD_WORDS]: {
          stage: null,
        },
        [AppState.TRAIN_WORDS]: {
          stage: null,
          type: 'word',
        },
        [AppState.DEFAULT]: {
          stage: null,
        },
      }),
      //@ts-ignore
      storage: new MongoDBAdapter<SessionData>({ collection }),
    }),
    getUserData,
    dialogsApi,
  )

  bot.use(addOrLearnMenu, dictSelectMenu, trainingTypeMenu)

  bot.command('start', async (ctx) => {
    if (!ctx.user) {
      throw new Error(`user with ${ctx.from?.id} doesn't exist`)
    }
    const dictionaries = ctx.user.dictionaries as string[]

    try {
      if (!dictionaries?.length) {
        const dict = await dictionaryResolver.createDictionary(ctx.user, { name: 'My first dictionary', words: [] })
        await ctx.reply(
          `Welcome ${ctx?.from?.username}! \nI've just created your first dictionary, go ahead and add some vocab in it!`,
        )
        ctx.session.activeDictionaryId = dict.id.toString()
        return ctx.dialog.enter(AppState.ADD_WORDS)
      }
      if (dictionaries.length === 1) {
        ctx.session.activeDictionaryId = dictionaries[0].toString()
        return await ctx.reply(`Welcome ${ctx?.from?.username}! \n\nWhat are you up today?`, {
          reply_markup: addOrLearnMenu,
        })
      } else if (dictionaries.length > 1) {
        const { dictionaries } = await ctx.user.populate<{ dictionaries: Dictionary[] }>('dictionaries')
        dictSelectMenu.row().dynamic((ctx, range) => {
          for (const dict of dictionaries) {
            range.text(dict?.name, (ctx) => ctx.reply(dict?._id || '')).row()
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

  bot.command('addwords', async (ctx) => ctx.dialog.enter(AppState.ADD_WORDS))
  bot.command('trainwords', async (ctx) => ctx.dialog.enter(AppState.TRAIN_WORDS))

  bot.on('msg:text', ...dialogs)

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
