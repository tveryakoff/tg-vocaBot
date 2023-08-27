import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import http from './http'

dotenv.config()

const bot = new Telegraf(`${process.env.API_KEY_BOT}`)
bot.telegram.setMyCommands([
  {
    command: 'new_word',
    description: 'Add new word to your vocabulary',
  },
  {
    command: 'lean_words',
    description: "Let's learn your words",
  },
])

bot.start(async (ctx) => {
  try {
    const user = ctx.from
    if (!user) {
      throw new Error('No user')
    }
    const response = await http.post('user', { user, token: process.env.API_KEY_BOT })
    ctx.reply(response?.data)
  } catch (e) {
    console.log('error', e)
  }
})

bot.command('new_word', async (ctx) => {
  try {
    ctx.reply(`Задайте слово для добавления в формате "слово - перевод"`)
  } catch (e) {
    console.log('error', e)
  }
})

bot.on('text', async (ctx) => {
  try {
    const user = ctx.from
    console.log(user)
    if (!user) {
      throw new Error('No user')
    }
    const pattern = new RegExp('^(.*?) - (.*)$')
    const message = ctx.update?.message?.text

    if (pattern.test(message)) {
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

bot.launch()
