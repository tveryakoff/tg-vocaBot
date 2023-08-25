import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!')
})

app.listen(3000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:3000`)
})
