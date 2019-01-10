'use strict'

const token = {
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  }
}

module.exports = { token }
