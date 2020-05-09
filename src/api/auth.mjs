import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {nanoid} from 'nanoid/async'
import dayjs from 'dayjs'
import dotenv from 'dotenv'

import * as db from './db.mjs'

dotenv.config()

const app = express()

app.use((req, res, next) => {
  setTimeout(next, 1000)
})

app.use(express.json())

function generateAccessToken(identity) {
  const expiresIn = parseInt(process.env.TOKEN_TTL)
  const accessToken = jwt.sign(identity, process.env.ACCESS_TOKEN, {expiresIn})
  const expireDate = dayjs().add(expiresIn, 'second').toDate()

  return [accessToken, expireDate]
}

function generateRefreshToken(identity) {
  return jwt.sign(identity, process.env.REFRESH_TOKEN)
}

app.post('/signup', async (req, res) => {
  try {
    const userMap = await db.fetchUsers()
    const id = await nanoid()
    const password = await bcrypt.hash(req.body.password, 10)

    userMap[id] = {
      id,
      login: req.body.login,
      role: 'customer',
      password,
      created: new Date(),
    }

    await db.updateUsers(userMap)

    res.sendStatus(201)
  } catch {
    res.sendStatus(500)
  }
})

app.post('/signin', async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = Object.values(userMap).find((u) => u.login === req.body.login)

  if (user == null) return res.sendStatus(400)

  try {
    const passwordsMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    )

    if (passwordsMatch) {
      const identity = {userId: user.id}
      const [accessToken, expireDate] = generateAccessToken(identity)
      const refreshToken = generateRefreshToken(identity)
      const payload = {accessToken, expireDate, refreshToken}

      await db.appendRefreshToken(refreshToken)

      res.status(200).send(payload)
    } else {
      res.sendStatus(400)
    }
  } catch {
    res.sendStatus(500)
  }
})

app.post('/token', async (req, res) => {
  const refreshToken = req.body.token

  if (refreshToken == null) return res.sendStatus(401)

  const exists = await db.checkRefreshToken(refreshToken)

  if (!exists) return res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, identity) => {
    if (error) return res.sendStatus(403)

    const newIdentity = {userId: identity.userId}
    const [accessToken, expireDate] = generateAccessToken(newIdentity)
    const payload = {accessToken, expireDate}

    res.json(payload)
  })
})

app.delete('/signout', async (req, res) => {
  await db.removeRefreshToken(req.body.token)

  res.sendStatus(204)
})

const port = process.env.AUTH_API_PORT

app.listen(port, () => {
  console.log(`Auth API server running at http://localhost:${port}`)
})
