import { ConfigurationInterface } from '../entities/Configuration'

export interface ConfigurationCrudRepository {

  create: (configuration: ConfigurationInterface) => Promise<ConfigurationInterface | null>
  findById: (id: string) => Promise<ConfigurationInterface | null>
  findByFileFormat: (fileFormat: string) => Promise<ConfigurationInterface | null>
  updateById: (id: string, configuration: ConfigurationInterface) => Promise<ConfigurationInterface | null>
  findAll: () => Promise<ConfigurationInterface[]>
  deleteAll: () => Promise<number>
  deleteById: (id: string) => Promise<boolean>

}
