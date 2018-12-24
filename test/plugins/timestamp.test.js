'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const timestamp = require('../../plugins/timestamp')

test('support works standalone', async (t) => {
  const fastify = Fastify()
  fastify.register(timestamp)

  t.plan(1)

  await fastify.ready()
  const ts = fastify.timestamp()
  t.ok(new Date(ts) > 0)
})
