import dotenv from 'dotenv'
import { ConfigurationCrudRepository } from '../domain/ports/ConfigurationCrudRepository'
import { ConfigurationInterface } from '../domain/entities/Configuration'
import { ApplicationError, HttpStatus } from '../../shared/application/ApplicationError'
import { MeliInputFileService } from '../../file/application/MeliInputFileService'

export class ConfigurationService {
  private readonly configurationCrudRepository: ConfigurationCrudRepository
  private meliInputFileService?: MeliInputFileService

  constructor (configurationCrudRepository: ConfigurationCrudRepository) {
    this.configurationCrudRepository = configurationCrudRepository

    dotenv.config()
  }

  setMeliInputFileService (meliInputFileService: MeliInputFileService): void {
    this.meliInputFileService = meliInputFileService
  }

  async create (configuration: ConfigurationInterface): Promise<ConfigurationInterface | null> {
    if (this.validateData(configuration)) {
      return await this.configurationCrudRepository.create(configuration)
    }
    return null
  }

  async findById (id: string): Promise<ConfigurationInterface | null> {
    if (id.trim().length === 0) {
      throw new ApplicationError('Id is required', HttpStatus.BAD_REQUEST)
    }
    return await this.configurationCrudRepository.findById(id)
  }

  async findByFileFormat (fileFormat: string): Promise<ConfigurationInterface | null> {
    if (fileFormat.trim().length === 0) {
      throw new ApplicationError('File Format is required', HttpStatus.BAD_REQUEST)
    }
    return await this.configurationCrudRepository.findByFileFormat(fileFormat)
  }

  async updateById (id: string, configuration: ConfigurationInterface): Promise<ConfigurationInterface | null> {
    if (id.trim().length === 0) {
      throw new ApplicationError('Id is required', HttpStatus.BAD_REQUEST)
    }
    return await this.configurationCrudRepository.updateById(id, configuration)
  }

  async findAll (): Promise<ConfigurationInterface[]> {
    return await this.configurationCrudRepository.findAll()
  }

  async deleteAll (): Promise<number> {
    return await this.configurationCrudRepository.deleteAll()
  }

  async deleteById (id: string): Promise<boolean> {
    if (id.trim().length === 0) {
      throw new ApplicationError('Id is required', HttpStatus.BAD_REQUEST)
    }
    return await this.configurationCrudRepository.deleteById(id)
  }

  validateData (configuration: ConfigurationInterface): boolean {
    let errorMessage = ''

    if (configuration.fileFormat === undefined || configuration.fileFormat === '') {
      errorMessage += 'File format is required, '
    }

    if (configuration.delimiter === undefined || configuration.delimiter === '') {
      errorMessage += 'Delimiter is required, '
    }

    if (configuration.encoding === undefined || configuration.encoding === '') {
      errorMessage += 'Encoding is required, '
    } else {
      this.meliInputFileService?.validateEncoding(configuration.encoding)
    }

    if (configuration.hasHeaders === undefined) {
      errorMessage += 'Has Headers is required, '
    } else if (typeof configuration.hasHeaders !== 'boolean') {
      errorMessage = 'Has headers is invalid, '
    }

    if (errorMessage.length > 0) {
      throw new ApplicationError(errorMessage, HttpStatus.BAD_REQUEST)
    }

    return true
  }
}
