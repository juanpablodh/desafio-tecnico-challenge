/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-new */
import { Types } from 'mongoose'
import { ApplicationError, HttpStatus } from '../../application/ApplicationError'

export class MongooseModelValidator {
  static validateId (id: string): boolean {
    try {
      new Types.ObjectId(id)
      return true
    } catch (error) {
      if (error instanceof Error && error.name === 'BSONError') {
        throw new ApplicationError('The provided ID is invalid', HttpStatus.BAD_REQUEST)
      }
      throw error
    }
  }
}
