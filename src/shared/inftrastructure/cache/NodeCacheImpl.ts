import { AppCache } from '../../domain/ports/AppCache'
import { ExpressServer } from '../server/ExpressServer'
export class NodeCacheImpl implements AppCache {
  get (key: string): any {
    return ExpressServer.nodeCache.get(key)
  }

  set (key: string, value: any): void {
    ExpressServer.nodeCache.set(key, value)
  }
}
