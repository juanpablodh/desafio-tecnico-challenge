/* eslint-disable @typescript-eslint/no-misused-promises */
import dotenv from 'dotenv'

import { ApiMercadoLibre } from '../infrastructure/gateway/ApiMercadolibre'
import { ItemCrudRepository } from '../domain/ports/ItemCrudRepository'
import { ItemInterface } from '../domain/entities/Item'
import { MeliInputFile } from '../../file/domain/entities/MeliInputFile'
import { FileProcessorFactory } from '../../file/application/FileProcessorFactory'
import { MeliInputFileService } from '../../file/application/MeliInputFileService'
import { CacheService } from '../../shared/application/CacheService'

export class ItemService {
  private readonly itemCrudRepository: ItemCrudRepository
  private readonly meliInputFileService: MeliInputFileService

  private cacheService?: CacheService

  constructor (itemCrudRepository: ItemCrudRepository, meliInputFileService: MeliInputFileService) {
    this.itemCrudRepository = itemCrudRepository
    this.meliInputFileService = meliInputFileService

    dotenv.config()
  }

  setCacheService (cacheService: CacheService): void {
    this.cacheService = cacheService
  }

  async createMany (items: ItemInterface[]): Promise<ItemInterface[]> {
    return await this.itemCrudRepository.createMany(items)
  }

  async buildItem (site: string, id: string): Promise<ItemInterface | undefined> {
    const responseItemMeli = await new ApiMercadoLibre().getItem(`${site}${id}`)

    if (responseItemMeli != null) {
      const item: ItemInterface = {
        price: responseItemMeli.price ?? 0,
        startTime: responseItemMeli.start_time ?? ''
      }

      if (responseItemMeli.category_id !== undefined) {
        const responseCategoryMeli = await new ApiMercadoLibre().getCategoryById(responseItemMeli.category_id)
        item.categoryName = responseCategoryMeli.name
      }

      if (responseItemMeli.currency_id !== undefined) {
        const responseCurrencyMeli = await new ApiMercadoLibre().getCurrencyById(responseItemMeli.currency_id)
        item.currencyDescription = responseCurrencyMeli.description
      }

      if (responseItemMeli.seller_id !== undefined) {
        const responseUserMeli = await new ApiMercadoLibre().getUserById(responseItemMeli.seller_id)
        item.sellerNickname = responseUserMeli.nickname
      }

      this.cacheService?.set(`${site}${id}`, item)

      return item
    }
  }

  async buildItems (itemsCodes: string): Promise<ItemInterface[] | undefined> {
    const responseItemsMeli = await new ApiMercadoLibre().multiGetItems(itemsCodes)

    if (responseItemsMeli.length > 0) {
      const asyncTasks = responseItemsMeli.map(async (responseItemMeli: any) => {
        if (responseItemMeli.body != null && responseItemMeli.code !== 404 && responseItemMeli.code !== 400) {
          const item: ItemInterface = {
            price: responseItemMeli.body.price ?? 0,
            startTime: responseItemMeli.body.start_time ?? ''
          }

          if (responseItemMeli.body.category_id !== undefined) {
            const responseCategoryMeli = await new ApiMercadoLibre().getCategoryById(responseItemMeli.body.category_id)
            item.categoryName = responseCategoryMeli.name
          }

          if (responseItemMeli.body.currency_id !== undefined) {
            const responseCurrencyMeli = await new ApiMercadoLibre().getCurrencyById(responseItemMeli.body.currency_id)
            item.currencyDescription = responseCurrencyMeli.description
          }

          if (responseItemMeli.body.seller_id !== undefined) {
            const responseUserMeli = await new ApiMercadoLibre().getUserById(responseItemMeli.body.seller_id)
            item.sellerNickname = responseUserMeli.nickname
          }

          this.cacheService?.set(responseItemMeli.body.id, {
            id: responseItemMeli.body.id,
            print: item.price,
            startTime: item.startTime,
            categoryName: item.categoryName,
            currencyDescription: item.currencyDescription,
            sellerNickname: item.sellerNickname
          })

          return item
        }
      })

      // Esperar a que todas las promesas se completen.
      const processedItems = await Promise.all(asyncTasks)

      // Filtrar elementos undefined (resultados de llamadas con error) y retornar el arreglo de elementos.
      return processedItems.filter(item => item !== undefined) as ItemInterface[]
    }

    return undefined
  }

  async findById (id: string): Promise<ItemInterface | null> {
    return await this.itemCrudRepository.findById(id)
  }

  async getAll (): Promise<ItemInterface[]> {
    return await this.itemCrudRepository.findAll()
  }

  async getAllPaging (page: number, limit: number): Promise<{ total: number, currentPage: number, items: ItemInterface[] }> {
    return {
      total: await this.itemCrudRepository.getCount(),
      currentPage: page,
      items: await this.itemCrudRepository.findAllPaging(page, limit)
    }
  }

  async deleteAll (): Promise<number> {
    return await this.itemCrudRepository.deleteAll()
  }

  async processFile (requestFile: MeliInputFile): Promise<{ message: string, apiErrors?: string[], fileErrors?: string[] } | undefined> {
    if (this.cacheService !== undefined) {
      const fileProcessorFactory = new FileProcessorFactory(this, this.meliInputFileService, this.cacheService)
      const fileProcesor = fileProcessorFactory.getProcessor(requestFile)
      return await fileProcesor.process(requestFile)
    }
  }

  public valdiateParams (params: { delimiter: string, lineNumber: number, site: string, id: string }): string[] {
    const errorMessage: string[] = []
    const regexWhiteSpaces = /\s/

    if (params.site == null || params.site === undefined || params.site.trim() === '') {
      errorMessage.push(`The [site] field for line number ${params.lineNumber} is not valid`)
    } else {
      if (params.delimiter !== ' ') {
        if (regexWhiteSpaces.test(params.site)) {
          errorMessage.push(`The [site] field [${params.site}] for line number ${params.lineNumber} contains whitespaces`)
        }
      }
    }
    if (params.id == null || params.id === undefined || params.id.trim() === '') {
      errorMessage.push(`The [id] field for line number ${params.lineNumber} is not valid`)
    } else {
      if (params.delimiter !== ' ') {
        if (regexWhiteSpaces.test(params.id)) {
          errorMessage.push(`The [id] field [${params.id}] for line number ${params.lineNumber} contains whitespaces`)
        }
      }
    }

    return errorMessage
  }
}
