'use strict'

const mongo = 'mongodb://localhost/todo-test'
const MongoClient = require('mongodb').MongoClient
const clean = require('mongo-clean')

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    mongo
  }
}

// automatically build and tear down our instance
function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.tearDown(app.close.bind(app))

  return app
}

async function cleandb (t) {
  try {
    const client = await MongoClient.connect(mongo, { w: 1, useNewUrlParser: true })
    await clean(client.db('todo-test'))
    await client.close()
  } catch (err) {
    t.fail(err)
  }
}

module.exports = {
  config,
  build,
  cleandb
}
