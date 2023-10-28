import { ExpressServer } from './shared/inftrastructure/server/ExpressServer'
import { MongooseDBConnection } from './shared/inftrastructure/database/MongooseDBConnection'
class Main {
  public async run (): Promise<void> {
    new ExpressServer().start()
    await new MongooseDBConnection().connect()
  }
}

new Main().run().catch(console.error)
