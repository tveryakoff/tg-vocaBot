import * as mongoose from 'mongoose'
import { ConnectOptions } from 'mongoose'

const connectMongoDb = async (dbConnectionUrl?: string, dbName?: string) => {
  try {
    await mongoose.connect(`${dbConnectionUrl}/?retryWrites=true&w=majority`, { dbName } as ConnectOptions)
    console.log('connected to Mongo Db')
  } catch (e) {
    console.log('Error during connection to mongo db', e)
  }
}

export default connectMongoDb
