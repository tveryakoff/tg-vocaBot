import express, { Express } from 'express'
import dotenv from 'dotenv'
import connectMongoDb from './db'
import router from './router'

dotenv.config()

const app: Express = express()

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/api', router)

connectMongoDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${process.env.PORT}`)
    })
  })
  .catch(() => {
    console.log('error')
  })
