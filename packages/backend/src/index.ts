import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import connectMongoDb from './db'
import router from './router'

dotenv.config()

const app: Express = express()

app.use(express.json())

app.use('/api', router)

connectMongoDb().then(() => {
  app.listen(3000, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:3000`)
  })
})
