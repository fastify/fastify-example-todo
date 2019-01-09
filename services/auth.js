'use strict'

const auth = require('basic-auth')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const credentials = auth(request) || { name: '', pass: '' }

    const item = await this.mongo.db
      .collection('users')
      .findOne({ name: credentials.name }, { password: credentials.pass })

    if (
      item == null ||
      credentials.name !== item.name ||
      credentials.pass !== item.password
    ) {
      return new Error('Invalid username or password')
    } else {
      const token = fastify.jwt.sign(
        { sub: credentials.name },
        { expiresIn: '1h' }
      )
      reply.send({ token })
    }
  })
}

module.exports.autoPrefix = '/auth'
