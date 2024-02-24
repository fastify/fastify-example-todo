'use strict'

const schemas = require('../schemas/auth')

module.exports = async function (fastify, opts) {
  fastify.post('/token', { schema: schemas.token }, async function (request, reply) {
    const { username, password } = request.body

    const user = await this.mongo.db
      .collection('users')
      .findOne({ username, password })

    if (
      user == null ||
      user.username !== username ||
      user.password !== password
    ) {
      reply.status(401).send({ message: 'Invalid username or password' })
    } else {
      const token = fastify.jwt.sign(
        { sub: user.username },
        { expiresIn: '1h' }
      )
      reply.send({ token })
    }
  })
}

module.exports.autoPrefix = '/auth'
