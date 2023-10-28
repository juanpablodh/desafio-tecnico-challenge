import { ConfigurationInterface } from '../../configuration/domain/entities/Configuration'
import { HelpFileInfo } from '../../configuration/domain/entities/HelpFileInfo'
import { ConfigurationCrudRepository } from '../../configuration/domain/ports/ConfigurationCrudRepository'
import { ApplicationError, HttpStatus } from '../../shared/application/ApplicationError'
import { MeliInputFile } from '../domain/entities/MeliInputFile'

export class MeliInputFileService {
  configurationCrudRepository: ConfigurationCrudRepository

  constructor (configurationCrudRepository: ConfigurationCrudRepository) {
    this.configurationCrudRepository = configurationCrudRepository
  }

  public async validateFile (file: MeliInputFile): Promise< ConfigurationInterface > {
    const mimetype = file.mimetype

    const configuration = await this.configurationCrudRepository.findByFileFormat(mimetype)
    if (configuration !== null) {
      this.validateEncoding(configuration.encoding)
      return configuration
    } else {
      throw new ApplicationError(`There is no configuration for this [${mimetype}] file format yet, please set one up and try again`, HttpStatus.BAD_REQUEST)
    }
  }

  public validateDelimiter (line: string, delimiter: string): boolean {
    if (
      line.split('').reduce((count, char) => {
        return char === delimiter ? count + 1 : count
      }, 0) >= 1
    ) {
      return true
    }
    return false
  }

  public validateEncoding (encoding: string): boolean {
    const validEncodings = HelpFileInfo.getEncodingList()

    if (!validEncodings.includes(encoding)) {
      throw new ApplicationError(`Invalid encoding: [${encoding}]. Please use one of the following encodings: ${validEncodings.join(', ')}`, HttpStatus.BAD_REQUEST)
    }

    return true
  }
}
