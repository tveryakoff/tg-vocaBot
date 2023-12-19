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
import { selectActiveDictionaryMenu } from './menus/Dictionary/SelectActiveDictionary'
import { selectEditDictionaryMenu } from './menus/Dictionary/SelectEditDictionary'
import manageDictionaryMenu, { editDictionaryWordsSubmenu } from './menus/Dictionary/ManageDictionary'
import skipContextMenu from './menus/SkipContextMenu'
import { showContextHint } from './menus/ShowContextHint'
import ErrorHandler from '../../../services/error/ErrorHandler'

export class TgBot {
  public readonly bot: Bot<MyContext>
  private readonly errorHandler: ErrorHandler

  constructor() {
    this.bot = new Bot<MyContext>(`${process.env.API_KEY_BOT}`, { ContextConstructor: MyContext })
    this.errorHandler = new ErrorHandler()
  }

  private async resetState(ctx: MyContext) {
    await ctx.reply(`Oops, an error occurred, let's try again!`)
    return await ctx.enterDialog('start')
  }

  private async errorBoundary(err: BotError<MyContext> & { method: string }) {
    const originalError: Error = err.error as Error

    //@ts-ignore
    if (originalError.method === 'editMessageReplyMarkup') {
      return
    }

    await this.errorHandler.handleError(originalError, () => this.resetState(err.ctx))
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
    this.bot.use(
      showContextHint,
      studyTypeMenu,
      addOrLearnMenu,
      editWordMenuType,
      selectActiveDictionaryMenu,
      selectEditDictionaryMenu,
      editDictionaryWordsSubmenu,
      manageDictionaryMenu,
      skipContextMenu,
    )
  }

  async setCommands() {
    await this.bot.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'addwords', description: 'Add words' },
      { command: 'studywords', description: 'Study words' },
      { command: 'editwords', description: 'Edit words' },
      { command: 'createdictionary', description: 'Create a new dictionary (max: 5)' },
      { command: 'selectdictionary', description: 'Select a dictionary to work with' },
      { command: 'managedictionaries', description: 'Manage your dictionaries' },
    ])

    this.bot.command('start', async (ctx) => ctx.enterDialog('start'))
    this.bot.command('addwords', async (ctx) => ctx.enterDialog('addWords'))
    this.bot.command('studywords', async (ctx) => ctx.enterDialog('studyWords'))
    this.bot.command('editwords', async (ctx) => ctx.enterDialog('editWords'))
    this.bot.command('createdictionary', async (ctx) => ctx.enterDialog('addDictionary'))
    this.bot.command('selectdictionary', async (ctx) => ctx.enterDialog('selectActiveDictionary'))
    this.bot.command('managedictionaries', async (ctx) => ctx.enterDialog('manageDictionary'))
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

    this.bot.catch(this.errorBoundary)

    await this.bot.start({
      onStart: () => {
        console.log('Bot has been started!')
      },
    })
  }
}
