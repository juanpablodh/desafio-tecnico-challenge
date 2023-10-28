/* eslint-disable @typescript-eslint/restrict-plus-operands */
import https from 'https'
import dotenv from 'dotenv'

export class ApiMercadoLibre {
  private readonly options

  constructor () {
    dotenv.config()
    this.options = {
      hostname: 'api.mercadolibre.com',
      path: '',
      method: '',
      headers: {
        Authorization: ' ' + String(process.env.BEARER_TOKEN) ?? ''
      }
    }
  }

  async getItem (itemCode: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.options.method = 'GET'
      this.options.path = `/items/${itemCode}?&attributes=start_time,price,category_id,currency_id,seller_id`
      // this.options.path = `/items/${itemCode}`
      const request = https.request(this.options, response => {
        let data = ''

        response.on('data', chunk => {
          data += chunk
        })

        response.on('end', () => {
          if (response.statusCode === 404) {
            // console.error(`Item API: Item [${itemCode}] not found`)
            resolve(null)
          } else {
            try {
              const responseJSON = JSON.parse(data)
              resolve(responseJSON)
            } catch (err) {
              console.error(`Item API: Item [${itemCode}] invalid response`)
            }
          }
        })
      })

      request.on('error', error => {
        console.error('Error: ' + error.message)
        resolve(null)
      })
      request.end()
    })
  }

  async multiGetItems (groupCodes: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.options.method = 'GET'
      this.options.path = `/items?ids=${groupCodes}&attributes=start_time,price,category_id,currency_id,seller_id,id`

      const request = https.request(this.options, response => {
        let data = ''

        response.on('data', chunk => {
          data += chunk
        })

        response.on('end', () => {
          if (response.statusCode === 404) {
            console.error('Item API: Item  not found')
            resolve(null)
          } else {
            try {
              const responseJSON = JSON.parse(data)
              resolve(responseJSON)
            } catch (err) {
              // console.error(`Item API: Item [${itemCode}] invalid response`)
            }
          }
        })
      })

      request.on('error', error => {
        console.error('Error: ' + error.message)
        resolve(null)
      })
      request.end()
    })
  }

  async getCurrencyById (idCurrency: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.options.method = 'GET'
      this.options.path = `/currencies/${idCurrency}?&attributes=description`
      const request = https.request(this.options, response => {
        let data = ''

        response.on('data', chunk => {
          data += chunk
        })

        response.on('end', () => {
          if (response.statusCode === 404) {
            console.error(`Curency API: Currency [${idCurrency}] not found`)
            resolve(null)
          } else {
            try {
              const responseJSON = JSON.parse(data)
              resolve(responseJSON)
            } catch (err) {
              resolve(null)
            }
          }
        })
      })

      request.on('error', error => {
        console.error('Error: ' + error.message)
        resolve(null)
      })
      request.end()
    })
  }

  async getCategoryById (idCategory: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.options.method = 'GET'
      this.options.path = `/categories/${idCategory}?&attributes=name`
      const request = https.request(this.options, response => {
        let data = ''

        response.on('data', chunk => {
          data += chunk
        })

        response.on('end', () => {
          if (response.statusCode === 404) {
            console.error(`Category API: Category [${idCategory}] not found`)
            resolve(null)
          } else {
            try {
              const responseJSON = JSON.parse(data)
              resolve(responseJSON)
            } catch (err) {
              resolve(null)
            }
          }
        })
      })

      request.on('error', error => {
        console.error('Error: ' + error.message)
        resolve(null)
      })
      request.end()
    })
  }

  async getUserById (idUser: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.options.method = 'GET'
      this.options.path = `/users/${idUser}?&attributes=nickname`
      const request = https.request(this.options, response => {
        let data = ''

        response.on('data', chunk => {
          data += chunk
        })

        response.on('end', () => {
          if (response.statusCode === 404) {
            console.error(`User API: User [${idUser}] not found`)
            resolve(null)
          } else {
            try {
              const responseJSON = JSON.parse(data)
              resolve(responseJSON)
            } catch (err) {
              resolve(null)
            }
          }
        })
      })

      request.on('error', error => {
        console.error('Error: ' + error.message)
        resolve(null)
      })
      request.end()
    })
  }
}
