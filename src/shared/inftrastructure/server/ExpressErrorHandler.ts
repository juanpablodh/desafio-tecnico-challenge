/* eslint-disable @typescript-eslint/no-extraneous-class */
import { NextFunction, Request, Response } from 'express'
import { ApplicationError, HttpStatus } from '../../application/ApplicationError'

export class ExpressErrorHandler {
  static handleError = (error: any, request: Request, response: Response, next: NextFunction): void => {
    // By default errors
    let messageError = 'Oops, something went wrong'
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR

    if (error instanceof ApplicationError) {
      messageError = error.message
      statusCode = error.code
    }

    if (error instanceof SyntaxError) {
      if (error.stack !== undefined) {
        if (error.stack.includes('body-parser')) {
          messageError = 'Input data is not valid JSON'
          statusCode = HttpStatus.BAD_REQUEST
        } else {
          messageError = 'Oops! Something could do not be converted to valid object.'
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    }

    response.status(statusCode).json({
      response: {
        error: messageError
      }
    })
    console.error('Error: 🚫', error)
  }
}
