'use strict'

const getAll = { response: {
  200: {
    type: 'array',
    items: {
      properties: {
        // do not include _id field here so that it is removed from the response
        // _id: { type: 'string' },
        name: { type: 'string' },
        timestamp: { type: 'integer' },
        done: { type: 'boolean' }
      }
    }
  }
},
querystring: {
  limit: { type: 'integer' },
  offset: { type: 'integer' }
} }

module.exports = { getAll }
