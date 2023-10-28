/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable no-useless-catch */
import fs from 'fs'
import readline from 'readline'
import dotenv from 'dotenv'

import { ItemInterface } from '../../../item/domain/entities/Item'
import { MeliInputFile } from '../../domain/entities/MeliInputFile'
import { FileProcessor } from '../../domain/ports/FileProcessor'
import { MeliInputFileService } from '../MeliInputFileService'
import { ItemService } from '../../../item/application/ItemService'
import { CacheService } from '../../../shared/application/CacheService'

export class CSVFileProcessorImpl implements FileProcessor {
  readonly meliInputFileService: MeliInputFileService
  readonly itemService: ItemService

  readonly cacheService: CacheService

  constructor (meliInputFileService: MeliInputFileService, itemService: ItemService, cacheService: CacheService) {
    this.meliInputFileService = meliInputFileService
    this.itemService = itemService
    this.cacheService = cacheService
    dotenv.config()
  }

  async process (file: MeliInputFile): Promise<{ message: string, apiErrors?: string[], fileErrors?: string[] }> {
    const filePath = file.path
    try {
      const configuration = await this.meliInputFileService.validateFile(file)

      const totalItemsMeli: ItemInterface[] = []
      const apiErrors: string[] = []
      let fileErrors: string[] = []

      const fileStream = fs.createReadStream(filePath, {
        encoding: configuration.encoding as BufferEncoding
      })
      const rl = readline.createInterface({
        input: fileStream,
        output: process.stdout,
        terminal: false
      })

      let lineNumber: number = 1

      let skipHeaders = configuration.hasHeaders
      let delimiterWarning = false

      let itemCodes: string[] = []
      let groupCodes: string[] = []
      const batchSize = Number(process.env.PROCESS_BATCH_SIZE ?? 20)
      const groupIdSize = Number(process.env.PROCESS_GROUP_ID_SIZE ?? 100)

      for await (const line of rl) {
        if (skipHeaders) {
          skipHeaders = false
          lineNumber++
          continue
        }

        if (!this.meliInputFileService.validateDelimiter(line, configuration.delimiter) && !delimiterWarning) {
          fileErrors.push(`The delimiter [${configuration.delimiter}] may not be configured correctly for this file`)
          delimiterWarning = true
        }
        const [site, id] = line.split(configuration.delimiter)

        const lineErrors = this.itemService.valdiateParams({
          delimiter: configuration.delimiter,
          lineNumber,
          site,
          id
        })

        if (lineErrors.length === 0) {
          try {
            const itemCached = this.cacheService.get(`${site}${id}`)
            if (itemCached !== undefined) {
              totalItemsMeli.push(itemCached)
              await this.itemService.createMany([{
                price: itemCached.price,
                startTime: itemCached.startTime,
                categoryName: itemCached.categoryName,
                currencyDescription: itemCached.currencyDescription,
                sellerNickname: itemCached.sellerNickname
              }])
            } else {
              itemCodes.push(`${site}${id}`)
              if (itemCodes.length === groupIdSize) {
                groupCodes.push(itemCodes.join(','))
                itemCodes = []

                if (groupCodes.length === batchSize) {
                  const items = await this.processBatch(groupCodes)
                  await this.itemService.createMany(items)
                  totalItemsMeli.push(...items)
                  groupCodes = []
                }
              }
            }
          } catch (error) {
            console.error(error)
            if (error instanceof Error) {
              apiErrors.push(error.message)
            }
          }
        } else {
          fileErrors = [...fileErrors, ...lineErrors]
        }
        lineNumber++
      }

      if (groupCodes.length > 0) {
        const items = await this.processBatch(groupCodes)
        await this.itemService.createMany(items)
        totalItemsMeli.push(...items)
        groupCodes = []
      }

      if (itemCodes.length > 0) {
        try {
          groupCodes.push(itemCodes.join(','))
          const items = await this.processBatch(groupCodes)
          await this.itemService.createMany(items)
          totalItemsMeli.push(...items)
        } catch (error) {
          console.error(error)
          if (error instanceof Error) {
            apiErrors.push(error.message)
          }
        }
      }

      const message: string = `${totalItemsMeli.length} items were created`

      if (apiErrors.length > 0 || fileErrors.length > 0) {
        return {
          message,
          apiErrors,
          fileErrors
        }
      }
      return {
        message
      }
    } catch (error) {
      throw error
    } finally {
      fs.unlink(filePath, (err) => {
        if (err != null) {
          console.error('Error deleting the uploaded file.', err)
        }
      })
    }
  }

  async processBatch (groupItemCodes: string[]): Promise<ItemInterface[]> {
    const apiRequests = groupItemCodes.map(itemsCode => this.itemService.buildItems(itemsCode))

    try {
      const results = await Promise.all(apiRequests)

      // Flatten the array of arrays into a single array
      return results.flat().filter(result => result !== undefined) as ItemInterface[]
    } catch (error) {
      console.error('An error occurred while processing the batch:', error)
      return []
    }
  }
}
