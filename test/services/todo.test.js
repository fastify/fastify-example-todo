'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('test todo list functionality', async (t) => {
  t.test('should create an item', async (t) => {
    const app = build(t)

    const auth = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: 'dummy', password: 'dummy' }
    })

    const { token } = JSON.parse(auth.payload)

    await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: { name: 'my-first-item' }
    })

    const res = await app.inject({
      url: '/api/todo/my-first-item',
      headers: { Authorization: `Bearer ${token}` }
    })

    const payload = JSON.parse(res.payload)

    t.equal(payload.done, false)
    t.equal(payload.name, 'my-first-item')
    t.notSame(payload.timestamp, null)
  })

  t.test('should get all items', async (t) => {
    const app = build(t)

    const auth = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: 'dummy', password: 'dummy' }
    })

    const { token } = JSON.parse(auth.payload)

    await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: { name: 'my-first-item' }
    })

    await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: { name: 'my-second-item' }
    })

    const res = await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` }
    })

    const payload = JSON.parse(res.payload)

    t.equal(payload.length, 2)

    t.equal(payload[0].done, false)
    t.equal(payload[0].name, 'my-second-item')
    t.notSame(payload[0].timestamp, null)

    t.equal(payload[1].done, false)
    t.equal(payload[1].name, 'my-first-item')
    t.notSame(payload[1].timestamp, null)
  })

  t.test('should mark item as done', async (t) => {
    const app = build(t)

    const auth = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: 'dummy', password: 'dummy' }
    })

    const { token } = JSON.parse(auth.payload)

    await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: { name: 'my-first-item' }
    })

    await app.inject({
      url: '/api/todo/my-first-item',
      headers: { Authorization: `Bearer ${token}` },
      method: 'PUT',
      payload: { done: true }
    })

    const res = await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` }
    })

    const payload = JSON.parse(res.payload)

    t.equal(payload.length, 1)
    t.equal(payload[0].done, true)
    t.equal(payload[0].name, 'my-first-item')
    t.notSame(payload[0].timestamp, null)
  })

  t.test('should delete item', async (t) => {
    const app = build(t)

    const auth = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: 'dummy', password: 'dummy' }
    })

    const { token } = JSON.parse(auth.payload)

    await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      payload: { name: 'my-first-item' }
    })

    await app.inject({
      url: '/api/todo/my-first-item',
      headers: { Authorization: `Bearer ${token}` },
      method: 'DELETE'
    })

    const res = await app.inject({
      url: '/api/todo',
      headers: { Authorization: `Bearer ${token}` }
    })

    const payload = JSON.parse(res.payload)

    t.equal(payload.length, 0)
    t.same(payload, [])
  })

  t.test('should give 404 if requested item does not exist', async (t) => {
    const app = build(t)

    const auth = await app.inject({
      url: '/api/auth/token',
      method: 'POST',
      payload: { username: 'dummy', password: 'dummy' }
    })

    const { token } = JSON.parse(auth.payload)

    const res = await app.inject({
      url: '/api/todo/this-does-not-exist',
      headers: { Authorization: `Bearer ${token}` }
    })

    const payload = JSON.parse(res.payload)

    t.equal(res.statusCode, 404)
    t.same(payload, {
      message: 'Requested todo item does not exist'
    })
  })

  t.test('should give jwt token error', async (t) => {
    const app = build(t)

    const res = await app.inject({
      url: '/api/todo',
      headers: { Authorization: 'Bearer test' }
    })

    const payload = JSON.parse(res.payload)

    t.equal(res.statusCode, 500)
    t.equal(payload.message, 'The token is malformed.')
  })
})
