import swaggerJSDoc, { OAS3Definition } from 'swagger-jsdoc'
import dotenv from 'dotenv'

dotenv.config()
const swaggerDefinition: OAS3Definition = {

  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: '🚀​ Challenge Meli - API Rest Documentation',
    description: 'This Swagger documentation outlines the API specifications for a RESTful web service, specifically designed for handling configuration and item-related operations. It offers a comprehensive set of endpoints for managing configurations and items in various formats. The API provides both the configuration and item management functionalities with detailed request and response structures.',
    contact: {
      name: 'Juan Pablo Dominguez',
      url: 'https://github.com/juanpablodh'
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    }

  },
  externalDocs: {
    description: 'GitHub API Documentation',
    url: 'https://github.com/juanpablodh'
  },
  servers: [
    {
      url:   `http://localhost:${process.env.SERVER_PORT}/api/v1`
    }
  ],
  tags: [
    {
      name: 'Configuration',
      description: 'Configuration related endpoints'
    },
    {
      name: 'Item',
      description: 'Item related endpoints'
    }
  ],
  paths: {
    '/configuration': {
      get: {
        tags: ['Configuration'],
        summary: 'Retrieve a list of configurations.',
        operationId: ' getAll',
        description: 'Retrieve a list of configurations. Can be used to get a list of configurations.',
        responses: {
          200: {
            description: 'A list of configurations.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        total: {
                          type: 'integer',
                          example: 1
                        },
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Configuration'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Configurations not found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'Configurations not found'
                        }
                      }
                    }
                  }
                }
              }

            }
          }
        }
      },
      post: {
        tags: ['Configuration'],
        summary: 'Create a new configuration.',
        operationId: 'create',
        description: 'Create a new configuration.',
        requestBody: {
          description: 'Create a new configuration.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Configuration'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'A list of configurations.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        total: {
                          type: 'integer',
                          example: 1
                        },
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Configuration'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                examples: {
                  'Already, there is a configuration created': {
                    value: {
                      response: {
                        error: 'Already, there is a configuration created for [text/csv] file format. If you wish, you can modify the existing ones'
                      }
                    }
                  },
                  'Validation fields': {
                    value: {
                      response: {
                        error: 'File format is required, Delimiter is required, Encoding is required, Has Headers is required, Has headers is invalid'
                      }
                    }
                  }
                }
              }
            }
          }
        }

      },
      delete: {
        tags: ['Configuration'],
        summary: 'Delete all configurations.',
        operationId: ' deleteAll',
        description: 'Delete all configurations.',
        responses: {
          200: {
            description: 'Delete all configurations succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: '5 configurations were successfully deleted.'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Configurations not found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'No configurations were found to delete'
                        }
                      }
                    }
                  }
                }
              }

            }
          }
        }
      }
    },
    '/configuration/{id}': {
      get: {
        tags: ['Configuration'],
        summary: 'Retrieve a configuration.',
        operationId: 'getById',
        description: 'Retrieve a configuration.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Configuration id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Configuration found succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Configuration'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/ConfigurationNotFound404'
          },
          400: {
            $ref: '#/components/responses/MongooseInvalidID'
          }
        }
      },
      put: {
        tags: ['Configuration'],
        summary: 'Update a configuration.',
        operationId: 'updateById',
        description: 'Updates configuration data, providing the ID as a path parameter.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Configuration id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          description: 'Update a Configuration.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Configuration'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'Configuration updated succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'Configuration updated succesfully'
                        },
                        data: {
                          $ref: '#/components/schemas/Configuration'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/ConfigurationNotFound404'
          },
          400: {
            $ref: '#/components/responses/MongooseInvalidID'
          }
        }
      },
      delete: {
        tags: ['Configuration'],
        summary: 'Delete a configuration.',
        operationId: 'deleteById',
        description: 'Delete a configuration, providing the ID as a path parameter.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Configuration id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Configuration deleted succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'Configuration deleted succesfully'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/ConfigurationNotFound404'
          },
          400: {
            $ref: '#/components/responses/MongooseInvalidID'
          }
        }
      }
    },
    '/configuration/getByFileFormat': {
      get: {
        tags: ['Configuration'],
        summary: 'Retrieve a configuration by file format.',
        operationId: 'getByFileFormat',
        description: 'Retrieve a configuration by a file format. Can be used to get a specific configuration by it file format.',
        parameters: [{
          name: 'fileFormat',
          in: 'query',
          required: true,
          schema: {
            type: 'string'
          }
        }],
        responses: {
          200: {
            description: 'Configuration information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Configuration'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/ConfigurationNotFound404'
          }
        }
      }
    },
    '/configuration/getHelpFileInfo': {
      get: {
        tags: ['Configuration'],
        summary: 'Obtain help information for using the API.',
        operationId: 'getHelpFileInfo',
        description: 'Obtain help information for using the API, such as file formats and the most used encodings.',
        responses: {
          200: {
            description: 'Info Help information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            mimeTypesList: {
                              type: 'array',
                              items: {
                                $ref: '#/components/schemas/MimeType'
                              }
                            },
                            encodingList: {
                              type: 'array',
                              items: {
                                type: 'string'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/item': {
      get: {
        tags: ['Item'],
        summary: 'Retrieve all items.',
        operationId: 'getAll',
        description: 'Retrieve all items.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: true,
            schema: {
              type: 'number'
            }
          },
          {
            name: 'limit',
            in: 'query',
            required: true,
            schema: {
              type: 'number'
            }
          }
        ],
        responses: {
          200: {
            description: 'Items found succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        total: {
                          type: 'number',
                          example: 11855
                        },
                        totalPages: {
                          type: 'number',
                          example: 118
                        },
                        currentPage: {
                          type: 'number',
                          example: 10
                        },
                        items: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Item'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/ItemsNotFound404'
          }
        }
      },
      delete: {
        tags: ['Item'],
        summary: 'Delete all items.',
        operationId: 'deleteAll',
        description: 'Delete all items.',
        responses: {
          200: {
            description: 'Items deleted succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        messaage: {
                          type: 'string',
                          example: '4 items were successfully deleted.'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/ItemsNotFound404'
          }
        }
      }
    },
    '/item/{id}': {
      get: {
        tags: ['Item'],
        summary: 'Retrieve an item.',
        operationId: 'getById',
        description: 'Retrieve an item, providing the ID as a path parameter.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Configuration id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Item found succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Item'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/ItemNotFound404'
          },
          400: {
            $ref: '#/components/responses/MongooseInvalidID'
          }
        }
      }
    },
    '/item/loadItemsByFile': {
      post: {
        tags: ['Item'],
        summary: 'Load items from the mercadolibre API.',
        operationId: 'loadItemsByFile',
        description: 'Load items from the Mercadolibre API having as input a file with the Site and ID.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  archivo: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Items loaded succesfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'object',
                      properties: {
                        itemsCreated: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Item'
                          }
                        },
                        fileErrors: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          example: [
                            'The [site] field for line number 3 is not valid',
                            'The [id] field for line number 8 contains whitespaces'
                          ]
                        }

                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: '',
            content: {
              'application/json': {
                examples: {
                  'There is no configuration': {
                    value: {
                      response: {
                        error: 'There is no configuration for this [application/jsonlines] file format yet, please set one up and try again'
                      }
                    }
                  },
                  'Invalid Encoding': {
                    value: {
                      response: {
                        error: 'Invalid encoding: [utf-17]. Please use one of the following encodings: ascii, utf8, utf-8, utf16le, utf-16le, ucs2, ucs-2, base64, base64url, latin1, binary, hex'
                      }
                    }

                  }
                }

              }
            }
          }

        }
      }

    }
  },
  components: {
    schemas: {
      Configuration: {
        type: 'object',
        required: ['fileFormat', 'delimiter', 'encoding', 'hasHeaders'],
        properties: {
          fileFormat: {
            type: 'string',
            required: true,
            unique: true,
            example: 'text/csv'
          },
          delimiter: {
            type: 'string',
            required: true,
            example: ','
          },
          encoding: {
            type: 'string',
            required: true,
            example: 'utf-8'
          },
          hasHeaders: {
            type: 'boolean',
            required: true,
            example: true
          }
        }
      },
      Item: {
        type: 'object',
        properties: {
          price: {
            type: 'number',
            example: 100000
          },
          startTime: {
            type: 'string',
            example: '2023-07-13T19:41:24.000Z'
          },
          categoryName: {
            type: 'string',
            example: 'Morrales'
          },
          currencyDescription: {
            type: 'string',
            example: 'Peso colombiano'
          },
          sellerNickname: {
            type: 'string',
            example: 'NALSANISAS'
          }
        }
      },
      MimeType: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          extension: {
            type: 'string'
          }
        }

      }
    },
    responses: {
      MongooseInvalidID: {
        description: 'Invalid Id',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                response: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'The provided ID is invalid'
                    }

                  }
                }
              }
            }
          }
        }
      },
      ConfigurationNotFound404: {
        description: 'Configuration not found.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                response: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Configuration not found'
                    }
                  }
                }
              }
            }
          }

        }
      },
      ItemsNotFound404: {
        description: 'Items not found.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                response: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Items not found'
                    }
                  }
                }
              }
            }
          }

        }
      },
      ItemNotFound404: {
        description: 'Item not found.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                response: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Item not found'
                    }
                  }
                }
              }
            }
          }

        }
      }
    }
  }
}

const swaggerOptions: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: [
    './src/configuration/infrastructure/ConfigurationRestExpressController.ts'
  ]
}

export default swaggerJSDoc(swaggerOptions)
