'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')

const clean = require('mongo-clean')
const { MongoClient } = require('mongodb')
const { beforeEach, teardown } = require('tap')
const url = 'mongodb://localhost:27017'
const database = 'todo-test'

let client

beforeEach(async function () {
  if (!client) {
    client = await MongoClient.connect(
      url,
      {
        auth: {
          username: 'dummy',
          password: 'dummy'
        },
        w: 1
      }
    )
  }
  await clean(client.db(database))
  await client
    .db(database)
    .collection('users')
    .insertOne({ username: 'dummy', password: 'dummy' })
})

teardown(async function () {
  if (client) {
    await client.close()
    client = null
  }
})

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    auth: {
      secret: 'averyverylongsecret'
    },
    mongo: {
      client,
      database
    }
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
  t.teardown(app.close.bind(app))

  return app
}

module.exports = { build }
