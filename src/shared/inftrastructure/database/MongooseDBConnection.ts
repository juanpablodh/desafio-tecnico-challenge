import mongoose from 'mongoose'
import dotenv from 'dotenv'

export class MongooseDBConnection {
  private readonly uri = process.env.DB_URI ?? 'mongodb://mongodb:27017'
  private readonly dbName = process.env.DB_NAME ?? 'challenge-meli'

  constructor () {
    dotenv.config()
  }

  public async connect (): Promise<mongoose.Connection | undefined> {
    try {
      console.log('Connecting to MongoDB...')
      await mongoose.connect(this.uri, {
        dbName: this.dbName
      })
      console.log(`Using database: ${this.dbName}`)
      return mongoose.connection
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
  }

  public async close (): Promise<void> {
    try {
      await mongoose.connection.close()
    } catch (error) {
      console.error('Error closing MongoDB connection:', error)
    }
  }
}
