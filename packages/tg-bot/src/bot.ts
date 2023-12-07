import { Bot, BotError, HttpError, session } from 'grammy'
import { MyContext } from './context'
import mongoose from 'mongoose'
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb'
import connectMongoDb from '../../../services/db/connect'
import { addOrLearnMenu } from './menus/AddOrLearn'
import { INITIAL_SESSION_STATE } from './context/session'
import { SessionData } from './context/types'
import studyTypeMenu from './menus/StudyTypeMenu'
import editWordMenuType from './menus/EditWord'
import { selectActiveDictionaryMenu } from './menus/SelectActiveDictionary'

export class TgBot {
  public readonly bot: Bot<MyContext>

  constructor() {
    this.bot = new Bot<MyContext>(`${process.env.API_KEY_BOT}`, { ContextConstructor: MyContext })
  }

  private static async errorBoundary(err: BotError<MyContext>) {
    if (err instanceof HttpError) {
      console.error(`HttpError occurred in Dialog middleware`, err)
      await err.ctx.reply(`Seems like we're having some network problems, please try again`)
      return
    }

    console.error(`Bot error in Dialog middleware`, err)
    await err.ctx.reply(`Oops, an error occurred, let's try again!`)

    if (process.env.NODE_ENV === 'production') {
      return await err.ctx.enterDialog('start')
    }

    throw err
  }

  async connectToDb() {
    try {
      const { DB_CONNECTION_URI, DB_NAME } = process.env
      console.log(`connecting to DB ${DB_CONNECTION_URI}`)
      await connectMongoDb(DB_CONNECTION_URI, DB_NAME)
      console.log(`Connected to DB, starting the bot...`)
    } catch (e) {
      console.log('Error while connecting to DB', e)
      throw new Error('Connection DB error')
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
      await ctx.loadDataIntoContext()
      return await next()
    })
  }

  setMenus() {
    this.bot.use(studyTypeMenu, addOrLearnMenu, editWordMenuType, selectActiveDictionaryMenu)
  }

  async setCommands() {
    await this.bot.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'addwords', description: 'Add words' },
      { command: 'studywords', description: 'Study words' },
      { command: 'editwords', description: 'Edit words' },
      { command: 'createdictionary', description: 'Create a new dictionary (max: 5)' },
    ])

    this.bot.command('start', async (ctx) => ctx.enterDialog('start'))
    this.bot.command('addwords', async (ctx) => ctx.enterDialog('addWords'))
    this.bot.command('studywords', async (ctx) => ctx.enterDialog('studyWords'))
    this.bot.command('editwords', async (ctx) => ctx.enterDialog('editWords'))
    this.bot.command('createdictionary', async (ctx) => ctx.enterDialog('addDictionary'))
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

    this.bot.catch(TgBot.errorBoundary)

    return this.bot.start()
  }
}
