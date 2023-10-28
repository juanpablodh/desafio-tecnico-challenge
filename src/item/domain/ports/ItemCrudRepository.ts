import { ItemInterface } from '../entities/Item'

export interface ItemCrudRepository {
  createMany: (item: ItemInterface[]) => Promise<ItemInterface[]>
  findById: (id: string) => Promise<ItemInterface | null>
  findAll: () => Promise<ItemInterface[]>
  findAllPaging: (page: number, limit: number) => Promise<ItemInterface[]>
  getCount: () => Promise<number>
  deleteAll: () => Promise<number>
}
