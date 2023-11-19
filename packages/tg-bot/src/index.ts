import { Bot, Context, Api } from 'grammy'
import type { Update, UserFromGetMe } from 'grammy/types'

import dotenv from 'dotenv'
import http from './http'
import { addUserHeader } from './http/addUserHeader'

dotenv.config()

class MyContext extends Context {
  public jwtToken: string | null

  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me)
    this.jwtToken = null
  }
}

const bot = new Bot<MyContext>(`${process.env.API_KEY_BOT}`, { ContextConstructor: MyContext })

bot.api.setMyCommands([{ command: 'start', description: 'Start the bot' }])

bot.command('start', async (ctx) => {
  try {
    const user = ctx.from
    if (!user) {
      throw new Error('No user')
    }
    addUserHeader(http, ctx.from)
    const response = await http.post('auth/tg')
    const dictionaries = response?.data?.user?.dictionaries

    if (!dictionaries?.length) {
      const createDictResult = await http.post('dictionary', { name: `My first dictionary` })
      return ctx.reply(
        `Welcome ${ctx?.from?.username}! \n I've just created your first dictionary, go ahead and add some vocab in it!`,
      )
      //TODO start add-word dialog
    }


  } catch (e) {
    console.log('error', e)
  }
})

bot.on('message', async (ctx: MyContext) => {
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

bot.start()
