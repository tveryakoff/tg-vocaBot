import { Bot, Context, Api } from 'grammy'
import type { Update, UserFromGetMe } from 'grammy/types'

import dotenv from 'dotenv'
import http from './http'
import { NextFunction } from 'express'

dotenv.config()

class MyContext extends Context {
  public jwtToken: string | null

  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me)
    this.jwtToken = null
  }
}

const bot = new Bot(`${process.env.API_KEY_BOT}`, { ContextConstructor: MyContext })

bot.api.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'help', description: 'Show help text' },
  { command: 'settings', description: 'Open settings' },
])

bot.command('start', async (ctx: MyContext) => {
  try {
    const user = ctx.from
    if (!user) {
      throw new Error('No user')
    }
    const response = await http.post('auth/tg', { user, key: process.env.API_KEY_BOT })
    ctx.jwtToken = response?.data?.jwtToken
    ctx.reply(response?.data)
  } catch (e) {
    console.log('error', e)
  }
})

// Try to log a user in if ctx.jwtToken is missing
bot.use(async (ctx: MyContext, next: NextFunction) => {
  if (!ctx.jwtToken) {
    const response = await http.post('auth/tg', { user: ctx.from, key: process.env.API_KEY_BOT })
    ctx.jwtToken = response?.data?.jwtToken
  }
  await next()
})

bot.command('new_word', async (ctx: MyContext) => {
  try {
    ctx.reply(`Задайте слово для добавления в формате "слово - перевод"`)
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
        // ctx.reply(`This is your words pair – "${word.trim()}" > "${translation.trim()}"`)
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
