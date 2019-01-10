'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) { 
  fastify
    .register(require('fastify-mongodb'), {
      url: 'mongodb://localhost/todo',
      ...opts.mongo
    })
    .register(require('fastify-cors'))
    .register(require('fastify-helmet'))
    .register(require('fastify-jwt'), {
      secret: opts.auth ? opts.auth.secret : process.env.SECRET || 'youshouldspecifyalongsecret'
    })
    .setNotFoundHandler(function (request, reply) {
      reply
        .code(404)
        .type('application/json')
        .send({ message: 'Requested todo item does not exist' })
    })

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
