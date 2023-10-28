/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import express, { Application } from 'express'
import dotenv from 'dotenv'
import NodeCache from 'node-cache'
import path from 'path'

import ItemRestExpressController from '../../../item/infrastructure/ItemRestExpressController'
import ConfigurationRestExpressController from '../../../configuration/infrastructure/ConfigurationRestExpressController'
import { ExpressErrorHandler } from './ExpressErrorHandler'
import swaggerDefinition from '../../../docs/swagger'

import swaggerUI from 'swagger-ui-express'

export class ExpressServer {
  readonly app: Application
  static nodeCache: NodeCache
  constructor () {
    dotenv.config()
    this.app = express()
    this.setUpPort()
    this.middlewares()
    this.endpoints()
    ExpressServer.nodeCache = this.setUpCache()
  }

  private setUpPort (): void {
    this.app.set('port', process.env.SERVER_PORT ?? 4000)
  }

  private middlewares (): void {
    this.app.use(express.json())
  }

  private endpoints (): void {
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../../public/welcomeApiPage.html'))
    })
    this.app.use('/api/v1/item', ItemRestExpressController)
    this.app.use('/api/v1/configuration', ConfigurationRestExpressController)
    this.app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDefinition))
    this.app.use(ExpressErrorHandler.handleError)
  }

  private setUpCache (): NodeCache {
    return new NodeCache({
      stdTTL: 300,
      checkperiod: 300
    })
  }

  public start (): void {
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server running on port ${this.app.get('port')}`)
    })
  }
}
