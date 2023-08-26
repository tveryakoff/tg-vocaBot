import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import http from './http'

dotenv.config()

const bot = new Telegraf(`${process.env.API_KEY_BOT}`)

bot.on('text', async (ctx) => {
  try {
    const user = ctx.from
    if (!user) {
      throw new Error('No user')
    }
    const response = await http.post('user/add-word', user)
    ctx.reply(response?.data)
  } catch (e) {
    console.log('error', e)
  }
})
bot.launch()
