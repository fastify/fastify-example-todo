'use strict'

const schemas = require('../schemas/todo')

module.exports = async function (fastify, opts) {
  fastify.get('/', { schema: schemas.getAll }, function (request, reply) {
    // return items according to limit and offset
    const limit = request.query.limit != null ? parseInt(request.query.limit) : 0;
    const offset = request.query.offset != null ? parseInt(request.query.offset) : 0; 

    return this.mongo.db.collection('todo').find()
      .sort({timestamp: -1})
      .skip(offset)
      .limit(limit)
      .toArray()
  })

  fastify.post('/', async function (request, reply) {
    // create an item
    return this.mongo.db
      .collection('todo')
      .insertOne(Object.assign(request.body, { timestamp: this.timestamp(), done: false }))
  })

  fastify.put('/:name', async function (request, reply) {
    // update an item
    return this.mongo.db
      .collection('todo')
      .findOneAndUpdate({ name: request.params.name }, { $set: { done: request.body.done } })
  })

  fastify.delete('/:name', async function (request, reply) {
    // delete an item
    return this.mongo.db
      .collection('todo')
      .deleteOne({ name: request.params.name })
  })

  fastify.get('/error', async function (request, reply) {
    // oops
    throw new Error('boom')
  })
}

module.exports.autoPrefix = '/todo'