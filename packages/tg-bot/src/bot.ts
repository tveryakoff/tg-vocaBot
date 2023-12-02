import { Bot, session } from 'grammy'
import { AddWordsDialog, MyContext } from './context'
import mongoose from 'mongoose'
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb'
import connectMongoDb from '../../../services/db/connect'
import { addOrLearnMenu } from './menus/AddOrLearn'
import { INITIAL_SESSION_STATE } from './context/session'
import { SessionData } from './context/types'
import { userResolver } from '../../../services/db/resolvers/user'
import { mapTgUserFromToUser } from './auth/mapTgUserFromToUser'

export class TgBot {
  public readonly bot: Bot<MyContext>

  constructor() {
    this.bot = new Bot<MyContext>(`${process.env.API_KEY_BOT}`, { ContextConstructor: MyContext })
  }

  async connectToDb() {
    try {
      const { DB_CONNECTION_URI, DB_NAME } = process.env
      await connectMongoDb(DB_CONNECTION_URI, DB_NAME)
      console.log(`Connected to DB, starting the bot...`)
    } catch (e) {
      console.log('Error while connecting to DB', e)
    }
  }

  async loadSession() {
    const collection = mongoose.connection.db.collection<ISession>('sessions')

    this.bot.use(
      session({
        initial: () => ({ ...INITIAL_SESSION_STATE }),
        storage: new MongoDBAdapter<SessionData>({ collection }),
      }),
    )
  }

  async enrichContextObject() {
    this.bot.use(async (ctx, next) => {
      const user = await userResolver.createIfNotExist(mapTgUserFromToUser(ctx.from))
      if (user) {
        ctx.user = user
      }

      const activeDialogName = ctx?.session?.activeDialogName
      if (activeDialogName) {
        if (activeDialogName === 'addWords') {
          ctx.dialog = new AddWordsDialog(ctx)
        } else if (activeDialogName === 'studyWords') {
        }
      }
      return await next()
    })
  }

  setMenus() {
    this.bot.use(addOrLearnMenu)
  }

  async setCommands() {
    await this.bot.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'addwords', description: 'Add words' },
      { command: 'studywords', description: 'Study words' },
      { command: 'editwords', description: 'Edit words' },
    ])

    this.bot.command('addwords', async (ctx) => ctx.enterDialog('addWords'))
    this.bot.command('studywords', async (ctx) => ctx.enterDialog('studyWords'))
  }

  setUserDialogs() {
    this.bot.on('message', (ctx) => ctx.handleDialogTextInput())
    this.bot.use((ctx) => ctx.handleDialogUpdate())
  }

  async start() {
    await this.connectToDb()
    await this.loadSession()
    await this.enrichContextObject()
    this.setMenus()
    await this.setCommands()
    this.setUserDialogs()

    return this.bot.start()
  }
}
