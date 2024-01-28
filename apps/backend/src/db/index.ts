import * as mongoose from 'mongoose'
import { ConnectOptions } from 'mongoose'

const connectMongoDb = async () => {
  const { DB_CONNECTION_URI, DB_NAME } = process.env

  try {
    await mongoose.connect(`${DB_CONNECTION_URI}/?retryWrites=true&w=majority`, { dbName: DB_NAME } as ConnectOptions)
    console.log('connected to Mongo Db')
  } catch (e) {
    console.log('Error during connection to mongo db', e)
  }
}

export default connectMongoDb
