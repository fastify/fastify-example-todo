'use strict'

const findAll = {
  response: {
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
  }
}

const findOne = {
  response: {
    200: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        timestamp: { type: 'integer' },
        done: { type: 'boolean' }
      }
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  },
  params: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
}

const insertOne = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
}

const updateOne = {
  body: {
    type: 'object',
    properties: {
      done: { type: 'boolean' }
    }
  },
  params: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
}

const deleteOne = {
  params: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
}

module.exports = { findAll, findOne, insertOne, updateOne, deleteOne }
