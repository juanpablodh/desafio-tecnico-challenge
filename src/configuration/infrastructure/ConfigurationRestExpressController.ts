/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response, NextFunction } from 'express'
import { ConfigurationInterface } from '../domain/entities/Configuration'
import { ConfigurationService } from '../application/ConfigurationService'
import { ConfigurationCrudRepositoryMongooseImpl } from './adapters/databases/ConfigurationCrudRepositoryMongooseImpl'
import { HelpFileInfo } from '../domain/entities/HelpFileInfo'
import { MeliInputFileService } from '../../file/application/MeliInputFileService'

class ConfigurationRestExpressController {
  router: Router

  constructor () {
    this.router = Router()
    this.setUpEndpoints()
  }

  private setUpEndpoints (): void {
    this.router.get('/', this.getAll)
    this.router.get('/getByFileFormat', this.getByFileFormat)
    this.router.get('/getHelpFileInfo', this.getHelpFileInfo)
    this.router.get('/:id', this.getById)
    this.router.post('/', this.create)
    this.router.put('/:id', this.updateById)
    this.router.delete('/:id', this.deleteById)
    this.router.delete('/', this.deleteAll)
  }

  public async getAll (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const configurations: ConfigurationInterface[] = await new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()).findAll()

      if (configurations.length > 0) {
        response.status(200).json({
          response: {
            total: configurations.length,
            data: configurations
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'Configurations not found'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public async getById (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const configuration = await new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()).findById(request.params.id)
      if (configuration != null) {
        response.status(200).json({
          response: {
            data: configuration
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'Configuration not found'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }

  private async getByFileFormat (request: Request, response: Response): Promise<void> {
    const configuration = await new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()).findByFileFormat(String(request.query.fileFormat))
    if (configuration != null) {
      response.status(200).json({
        response: {
          data: configuration
        }
      })
    } else {
      response.status(404).json({
        response: {
          message: 'Configuration not found'
        }
      })
    }
  }

  public async create (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const configurationService = new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl())
      configurationService.setMeliInputFileService(new MeliInputFileService(new ConfigurationCrudRepositoryMongooseImpl()))
      const configurationCreated = await configurationService.create(request.body)
      response.status(201).json({
        response: {
          message: 'Configuration created successfully',
          data: configurationCreated
        }
      })
    } catch (error) {
      next(error)
    }
  }

  public async updateById (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = request.params.id
      const newConfigurationData = request.body

      const updatedConfiguration = await new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()).updateById(id, newConfigurationData)
      if (updatedConfiguration != null) {
        response.status(200).json({
          response: {
            message: 'Configuration updated successfully',
            data: updatedConfiguration
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'Configuration not found'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public async deleteById (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      if (await new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()).deleteById(request.params.id)) {
        response.status(200).json({
          response: {
            message: 'Configuration deleted successfully'
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'Configuration not found'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public async deleteAll (request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const deleteCount = await new ConfigurationService(new ConfigurationCrudRepositoryMongooseImpl()).deleteAll()

      if (deleteCount > 0) {
        response.status(200).json({
          response: {
            message: `${deleteCount} configurations were successfully deleted.`
          }
        })
      } else {
        response.status(404).json({
          response: {
            message: 'No configurations were found to delete'
          }
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public getHelpFileInfo (request: Request, response: Response, next: NextFunction): void {
    try {
      response.status(200).json({
        response: {
          data: {
            mimeTypesList: HelpFileInfo.getMimeTypesList(),
            encodingList: HelpFileInfo.getEncodingList()
          }
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

const configurationRestController = new ConfigurationRestExpressController()
export default configurationRestController.router
