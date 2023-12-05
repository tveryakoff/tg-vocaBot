import * as mongoose from 'mongoose'

const connectMongoDb = async (dbConnectionUrl?: string, dbName?: string) => {
  try {
    await mongoose.connect(`${dbConnectionUrl}/?retryWrites=true&w=majority`, { dbName })
    console.log('connected to Mongo Db')
  } catch (e) {
    console.log('Error during connection to mongo db', e)
    throw e
  }
}

export default connectMongoDb
