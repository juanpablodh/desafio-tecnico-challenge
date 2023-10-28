import { ItemService } from '../../item/application/ItemService'
import { ApplicationError, HttpStatus } from '../../shared/application/ApplicationError'
import { CacheService } from '../../shared/application/CacheService'
import { MeliInputFile } from '../domain/entities/MeliInputFile'
import { FileProcessor } from '../domain/ports/FileProcessor'
import { CSVFileProcessorImpl } from './adapters/CSVFileProcessorImpl'
import { JSONLINESFileProcessorImpl } from './adapters/JSONLINESFileProcessorImpl'
import { NoFormatFileProcessorImpl } from './adapters/NoFormatFileProcessorImpl'
import { TXTFileProcessorImpl } from './adapters/TXTFileProcessorImpl'
import { MeliInputFileService } from './MeliInputFileService'

export class FileProcessorFactory {
  itemService: ItemService
  meliInputFileService: MeliInputFileService
  cacheService: CacheService

  constructor (itemService: ItemService, meliInputFileService: MeliInputFileService, cacheService: CacheService) {
    this.itemService = itemService
    this.meliInputFileService = meliInputFileService
    this.cacheService = cacheService
  }

  getProcessor (file: MeliInputFile): FileProcessor {
    switch (file.mimetype) {
      case 'application/octet-stream':
        if (file.extension === '.jsonl') {
          file.mimetype = 'application/jsonlines'
          return new JSONLINESFileProcessorImpl(this.meliInputFileService, this.itemService, this.cacheService)
        } else {
          return new NoFormatFileProcessorImpl(this.meliInputFileService, this.itemService, this.cacheService)
        }
      case 'text/csv':
        return new CSVFileProcessorImpl(this.meliInputFileService, this.itemService, this.cacheService)
      case 'text/plain':
        return new TXTFileProcessorImpl(this.meliInputFileService, this.itemService, this.cacheService)
      default:
        throw new ApplicationError('This file is not supported by the aplicator yet', HttpStatus.BAD_REQUEST)
    }
  }
}
