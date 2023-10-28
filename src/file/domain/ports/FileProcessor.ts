import { CacheService } from '../../../shared/application/CacheService'
import { MeliInputFile } from '../entities/MeliInputFile'

export interface FileProcessor {

  cacheService: CacheService
  process: (file: MeliInputFile) => Promise<{ message: string, apiErrors?: string[], fileErrors?: string[] }>
}
