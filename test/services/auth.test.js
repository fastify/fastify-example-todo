'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('test user authentication', async (t) => {
  t.test('should return a token', async (t) => {
    const app = build(t)

    const res = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: 'dummy', password: 'dummy' }
    })

    const { token } = JSON.parse(res.payload)

    t.ok(token)
  })

  t.test('should give Invalid username or password', async (t) => {
    const app = build(t)

    const res = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: 'wrong', password: 'wrong' }
    })

    const payload = JSON.parse(res.payload)

    t.notOk(payload.token)
    t.equal(res.statusCode, 401)
    t.equal(payload.message, 'Invalid username or password')
  })

  t.test('should not accept empty username or password', async t => {
    const app = build(t)

    const res = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: '', password: '' }
    })

    const payload = JSON.parse(res.payload)

    t.notOk(payload.token)
    t.equal(res.statusCode, 400)
    t.equal(
      payload.message,
      'body/username must NOT have fewer than 1 characters'
    )
  })

  t.test('should not accept missing username or password', async t => {
    const app = build(t)

    const res = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: {}
    })

    const payload = JSON.parse(res.payload)

    t.notOk(payload.token)
    t.equal(res.statusCode, 400)
    t.equal(
      payload.message,
      'body must have required property \'username\''
    )
  })
})
