/* eslint-disable no-new */
import mongoose, { Document, Schema, Types } from 'mongoose'
import { ConfigurationCrudRepository } from '../../../domain/ports/ConfigurationCrudRepository'
import { ConfigurationInterface } from '../../../domain/entities/Configuration'
import { MongooseModelValidator } from '../../../../shared/inftrastructure/database/MongooseModelValidator'
import { ApplicationError, HttpStatus } from '../../../../shared/application/ApplicationError'

export class ConfigurationCrudRepositoryMongooseImpl implements ConfigurationCrudRepository {
  async create (configuration: ConfigurationInterface): Promise<ConfigurationInterface> {
    try {
      const configurationCreated = await ConfigurationMongooseModel.create(configuration)
      return configurationCreated
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('E11000 duplicate key error')) {
          throw new ApplicationError(`Already, there is a configuration created for [${configuration.fileFormat}] file format. If you wish, you can modify the existing ones`, HttpStatus.BAD_REQUEST)
        }
      }
      throw error
    }
  }

  async findById (id: string): Promise<ConfigurationInterface | null> {
    if (MongooseModelValidator.validateId(id)) {
      const objectId = new Types.ObjectId(id)
      const configuration = await ConfigurationMongooseModel.findById(objectId).exec()
      return configuration
    }
    return null
  }

  async findByFileFormat (fileFormat: string): Promise<ConfigurationInterface | null> {
    const configuration = await ConfigurationMongooseModel.findOne({ fileFormat })
    return configuration
  }

  async updateById (id: string, configuration: ConfigurationInterface): Promise<ConfigurationInterface | null> {
    if (MongooseModelValidator.validateId(id)) {
      const objectId = new Types.ObjectId(id)
      const configurationUpdated = await ConfigurationMongooseModel.findByIdAndUpdate(objectId, configuration)
      return ((configurationUpdated?.isModified) != null) ? configuration : null
    }
    return null
  }

  async findAll (): Promise<ConfigurationInterface[]> {
    const configurations = await ConfigurationMongooseModel.find({})
    return configurations
  }

  async deleteAll (): Promise<number> {
    const configurations = await ConfigurationMongooseModel.deleteMany({})
    return configurations.deletedCount
  }

  async deleteById (id: string): Promise<boolean> {
    if (MongooseModelValidator.validateId(id)) {
      const objectId = new Types.ObjectId(id)
      const configurations = await ConfigurationMongooseModel.deleteOne({
        _id: objectId._id
      })
      return configurations.deletedCount === 1
    }
    return false
  }
}

interface ConfigurationModel extends Document {
  fileFormat: string
  delimiter: string
  encoding: string
  hasHeaders: boolean
}

const configurationSchema = new Schema<ConfigurationModel>({
  fileFormat: { type: String, required: true, unique: true },
  delimiter: { type: String, required: true },
  encoding: { type: String, required: true },
  hasHeaders: { type: Boolean, required: true }
})

const ConfigurationMongooseModel = mongoose.model<ConfigurationModel>('configurations', configurationSchema)
