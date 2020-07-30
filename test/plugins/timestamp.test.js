'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('support works standalone', async (t) => {
  const fastify = build(t)
  await fastify.ready()

  const ts = fastify.timestamp()
  t.ok(new Date(ts) > 0)
})
