import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {nanoid} from 'nanoid/async'
import dotenv from 'dotenv'

import * as db from './db.mjs'

dotenv.config()

const app = express()

app.use(express.json())

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (error, identity) => {
    if (error != null) return res.sendStatus(403).send(error.message)

    req.userId = identity.userId

    next()
  })
}

app.get('/me', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = userMap[req.userId]

  if (user == null) return res.sendStatus(404)

  delete user.password

  res.json(user)
})

app.get('/users', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()

  res.json(userMap)
})

app.get('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = userMap[req.params.id]

  if (user == null) res.status(404).send()
  else res.json(user)
})

app.post('/users', authenticateToken, async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)
    const id = await nanoid()
    const userMap = await db.fetchUsers()
    const user = {id, login: req.body.login, password, created: new Date()}

    userMap[id] = user

    await db.updateUsers(userMap)

    res.status(201).send(user)
  } catch {
    res.status(500).send()
  }
})

app.put('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = userMap[req.params.id]
  const password = await bcrypt.hash(req.body.password, 10)

  if (user != null) {
    user.login = req.body.login
    user.password = password

    res.status(202).send(user)
  } else {
    const user = {id: req.params.id, login: req.body.login, password}

    userMap[req.params.id] = user

    await db.updateUsers(userMap)

    res.status(201).send(user)
  }
})

app.delete('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await db.fetchUsers()

  if (req.params.id in userMap) {
    delete userMap[req.params.id]

    await db.updateUsers(userMap)

    res.status(204).send()
  } else {
    res.status(404).send()
  }
})

const port = process.env.MAIN_API_PORT

app.listen(port, () => {
  console.log(`Main API server running at http://localhost:${port}`)
})
