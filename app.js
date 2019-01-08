'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  // Place here your custom code!

  fastify.register(require('fastify-mongodb'), {
    url: 'mongodb://localhost/todo',
    ...opts.mongo
  })

  fastify.register(require('fastify-cors'))
  fastify.register(require('fastify-helmet'))

  fastify.setNotFoundHandler(function (request, reply) {
    reply
      .code(404)
      .type('application/json')
      .send({ message: 'Requested todo item does not exist' })
  })

  fastify.register(require('fastify-basic-auth'), { validate })

  async function validate (username, password, req, reply) {

    if(username !== 'admin' || password !== 'admin'){
      const item = await this.mongo.db
        .collection('users')
        .findOne({ name: username }, { password: password })  

      if (item == null || username !== item.name || password !== item.password) {
        return new Error('Invalid username or password')
      }
    }
  }

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({ prefix: '/api' }, opts)
  })

  // Make sure to call next when done
  next()
}
