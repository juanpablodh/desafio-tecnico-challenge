/* eslint-disable @typescript-eslint/no-misused-promises */
import multer from 'multer'
import path from 'path'
import { Request, Response, Router, NextFunction } from 'express'
import { ItemService } from '../application/ItemService'
import { ItemCrudRepositoryMongooseImpl } from './adapters/databases/ItemCrudRepositoryMongooseImpl'
import { MeliInputFile } from '../../file/domain/entities/MeliInputFile'
import { ApplicationError, HttpStatus } from '../../shared/application/ApplicationError'
import { ConfigurationService } from '../../configuration/application/ConfigurationService'
import { ConfigurationCrudRepositoryMongooseImpl } from '../../configuration/infrastructure/adapters/databases/ConfigurationCrudRepositoryMongooseImpl'
import { MeliInputFileService } from '../../file/application/MeliInputFileService'
import { CacheService } from '../../shared/application/CacheService'
import { ExpressServer } from '../../shared/inftrastructure/server/ExpressServer'

class ItemRestExpressController {
  router: Router

  constructor () {
    this.router = Router()
    this.setUpEndpoints()
  }

  private setUpEndpoints (): void {
    this.router.get('/', this.getAll)
    this.router.delete('/', this.deleteAll)
    this.router.get('/:id', this.getById)
    this.router.post('/loadItemsByFile', multer({ dest: 'src/uploads/' }).single('archivo'), this.loadItemsByFile)
  }

  public async getAll (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const items = await new ItemService(new ItemCrudRepositoryMongooseImpl(), new MeliInputFileService(new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()))).getAllPaging(Number(request.query.page), Number(request.query.limit))
      if (items.items.length > 0) {
        response.status(200).json({
          response: {
            total: items.total,
            totalPages: Math.floor(items.total / Number(request.query.limit)),
            currentPage: Number(request.query.page),
            items: items.items
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'Items not found'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public async loadItemsByFile (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      if (request.file == null) {
        throw new ApplicationError('The file was not found, please attach it and try again', HttpStatus.BAD_REQUEST)
      } else {
        const meliInputFile: MeliInputFile = { mimetype: request.file.mimetype, path: request.file.path, extension: path.extname(request.file.originalname) }
        const itemService = new ItemService(new ItemCrudRepositoryMongooseImpl(), new MeliInputFileService(new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl())))
        itemService.setCacheService(new CacheService(ExpressServer.nodeCache))
        const itemsCreated = await itemService.processFile(meliInputFile)

        response.status(200).json({
          response: itemsCreated
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public async deleteAll (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const deleteCount = await new ItemService(new ItemCrudRepositoryMongooseImpl(), new MeliInputFileService(new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()))).deleteAll()

      if (deleteCount > 0) {
        response.status(200).json({
          response: {
            message: `${deleteCount} items were successfully deleted.`
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'Items not found'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public async getById (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const item = await new ItemService(new ItemCrudRepositoryMongooseImpl(), new MeliInputFileService(new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()))).findById(request.params.id)
      if (item != null) {
        response.status(200).json({
          response: {
            data: item
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'Item not found'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

const itemRestController = new ItemRestExpressController()
export default itemRestController.router
