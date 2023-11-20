import { Bot, Context, Api, InlineKeyboard } from 'grammy'
import type { Update, UserFromGetMe } from 'grammy/types'
import { Menu } from '@grammyjs/menu'

import dotenv from 'dotenv'
import http from './http'
import { addUserHeader } from './http/addUserHeader'
import { Dictionary } from 'backend/src/types/user'
import { addOrLearnMenu } from './menus/trainOrLearn'
import { hasNoWords } from '../../utils /dictionary'

dotenv.config()

class MyContext extends Context {
  public tgId: number | null

  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me)
    this.tgId = null
  }
}

const dictSelectMenu = new Menu('dictSelect')

const bot = new Bot<MyContext>(`${process.env.API_KEY_BOT}`, { ContextConstructor: MyContext })

bot.api.setMyCommands([{ command: 'start', description: 'Start the bot' }])

bot.use(addOrLearnMenu, dictSelectMenu)

bot.on('message', async (ctx, next) => {
  if (!ctx.tgId) {
    ctx.tgId = ctx.from.id
    addUserHeader(http, ctx.from)
  }
  return await next()
})

bot.command('start', async (ctx) => {
  try {
    const user = ctx.from
    if (!user) {
      throw new Error('No user')
    }
    const response = await http.post('auth/tg')
    const dictionaries = response?.data?.user?.dictionaries

    if (!dictionaries?.length) {
      const createDictResult = await http.post('dictionary', { name: `My first dictionary` })
      return ctx.reply(
        `Welcome ${ctx?.from?.username}! \nI've just created your first dictionary, go ahead and add some vocab in it!`,
        //TODO start add-word dialog
      )
    }

    const noWords = hasNoWords(dictionaries)

    if (dictionaries.length === 1) {
      return await ctx.reply(`Welcome ${ctx?.from?.username}! \n\nWhat are you up today?`, {
        reply_markup: addOrLearnMenu,
      })
    } else if (dictionaries.length === 1) {
      dictSelectMenu.row().dynamic((ctx, range) => {
        for (const dict of dictionaries) {
          range // no need for `new MenuRange()` or a `return`
            .text(dict.name, (ctx) => ctx.reply(dict?._id))
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
