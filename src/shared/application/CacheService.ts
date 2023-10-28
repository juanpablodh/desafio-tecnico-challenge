import { AppCache } from '../domain/ports/AppCache'

export class CacheService {
  cacheClient: AppCache

  constructor (cacheClient: AppCache) {
    this.cacheClient = cacheClient
  }

  public get (key: string): any {
    return this.cacheClient.get(key)
  }

  public set (key: string, value: any): void {
    this.cacheClient.set(key, value)
  }

  public setMany (elments: [{ key: string, value: any }]): void {
    elments.forEach((element) => this.set(element.key, element.value))
  }
}
