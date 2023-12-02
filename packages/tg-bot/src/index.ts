import dotenv from 'dotenv'
import { TgBot } from './bot'

dotenv.config()

const bot = new TgBot()
bot.start()
