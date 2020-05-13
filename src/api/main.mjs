import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {nanoid} from 'nanoid/async'
import dotenv from 'dotenv'

import * as db from './db.mjs'

dotenv.config()

const app = express()

app.use((req, res, next) => {
  setTimeout(next, 1000)
})

app.use(express.json())

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (error, identity) => {
    if (error != null) return res.status(403).send(error.message)

    req.userId = identity.userId

    next()
  })
}

//#region ACCOUNT
app.get('/me', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = userMap[req.userId]

  if (user == null) return res.sendStatus(404)

  delete user.password

  res.json(user)
})

app.put('/cart', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = userMap[req.userId]

  if (user == null) return res.sendStatus(404)

  user.cart = req.body.cart

  await db.updateUsers(userMap)

  res.sendStatus(204)
})

app.post('/purchase', authenticateToken, async (req, res) => {
  const _db = await db.fetchDb()

  const user = _db.users[req.userId]
  const {entries, promoCode} = req.body

  if (user == null) return res.sendStatus(404)

  for (const productId in entries) {
    const amount = entries[productId]
    const product = _db.products[productId]

    if (product?.quantity >= amount) product.quantity -= amount
    else
      return res
        .status(400)
        .send({message: 'Some product(s) out of stock', data: {productId}})
  }

  user.cart = {}

  await db.updateDb(_db)

  res.sendStatus(204)
})
//#endregion

//#region PRODUCTS
app.get('/products', async (req, res) => {
  const products = await db.fetchProducts()

  res.json(products)
})
//#endregion

//#region USERS
app.get('/users', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()

  res.json(userMap)
})

app.get('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = userMap[req.params.id]

  if (user == null) return res.sendStatus(404)

  res.json(user)
})

app.post('/users', authenticateToken, async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10)
  const id = await nanoid()
  const userMap = await db.fetchUsers()
  const user = {id, login: req.body.login, password, created: new Date()}

  userMap[id] = user

  await db.updateUsers(userMap)

  res.status(201).send(user)
})

app.put('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = userMap[req.params.id]
  const password = await bcrypt.hash(req.body.password, 10)

  if (user == null) {
    userMap[req.params.id] = {
      id: req.params.id,
      login: req.body.login,
      password,
      cart: {},
      role: req.body.role,
    }
  } else {
    user.login = req.body.login
    user.password = password
    user.role = req.body.role
  }

  await db.updateUsers(userMap)

  res.sendStatus(204)
})

app.delete('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()

  if (req.params.id in userMap) {
    delete userMap[req.params.id]

    await db.updateUsers(userMap)

    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
//#endregion

const port = process.env.MAIN_API_PORT

app.listen(port, () => {
  console.log(`Main API server running at http://localhost:${port}`)
})
