import { ItemCrudRepository } from '../../../domain/ports/ItemCrudRepository'
import mongoose, { Document, Schema } from 'mongoose'
import { ItemInterface } from '../../../domain/entities/Item'
import { MongooseModelValidator } from '../../../../shared/inftrastructure/database/MongooseModelValidator'

export class ItemCrudRepositoryMongooseImpl implements ItemCrudRepository {
  async create (item: ItemInterface): Promise<ItemInterface> {
    const itemCreated = await ItemMongooseModel.create(item)
    return itemCreated
  }

  async createMany (items: ItemInterface[]): Promise<ItemInterface[]> {
    const itemsCreated = await ItemMongooseModel.create(items)
    return itemsCreated
  }

  async findById (id: string): Promise<ItemInterface | null> {
    if (MongooseModelValidator.validateId(id)) {
      const item = await ItemMongooseModel.findById(id).exec()
      return item
    }
    return null
  }

  async findAll (): Promise<ItemInterface[]> {
    const items = await ItemMongooseModel.find({})
    return items
  }

  async findAllPaging (page: number = 1, limit: number = 10): Promise<ItemInterface[]> {
    const items = await ItemMongooseModel.find({}).limit(limit * 1).skip((page - 1) * limit)
    return items
  }

  async getCount (): Promise<number> {
    return await ItemMongooseModel.countDocuments({}).exec()
  }

  async deleteAll (): Promise<number> {
    const items = await ItemMongooseModel.deleteMany({})
    return items.deletedCount
  }
}

interface ItemModel extends Document {
  price?: number
  startTime?: string
  categoryName?: string
  currencyDescription?: string
  sellerNickname?: string
}

const itemSchema = new Schema<ItemModel>({
  price: { type: Number, required: false },
  startTime: { type: String, required: false },
  categoryName: { type: String, required: false },
  currencyDescription: { type: String, required: false },
  sellerNickname: { type: String, required: false }
})

const ItemMongooseModel = mongoose.model<ItemModel>('items', itemSchema)
