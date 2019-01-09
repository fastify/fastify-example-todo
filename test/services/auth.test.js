'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('test auth list functionality', async (t) => {
  t.test('should return a token', async (t) => {
    const app = build(t)

    const res = await app.inject({
      url: '/api/auth',
      headers: { Authorization: 'Basic ZHVtbXk6ZHVtbXk=' }
    })

    const payload = JSON.parse(res.payload)

    t.ok(payload.token)
  })
  t.test('should give Invalid username or password', async (t) => {
    const app = build(t)

    const res = await app.inject({
      url: '/api/auth',
      headers: { Authorization: 'Basic ' }
    })

    const payload = JSON.parse(res.payload)

    t.notOk(payload.token)
    t.is(res.statusCode, 500)
    t.is(payload.message, 'Invalid username or password')
  })
})
