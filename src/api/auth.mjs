import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {nanoid} from 'nanoid/async'
import dayjs from 'dayjs'
import dotenv from 'dotenv'

import * as db from './dbal.mjs'

dotenv.config()

const app = express()

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
    const password = await bcrypt.hash(req.body.password, 10)
    const id = await nanoid()
    const userMap = await db.fetchUsers()
    const user = {id, login: req.body.login, password, created: new Date()}

    userMap[id] = user

    await db.updateUsers(userMap)

    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/signin', async (req, res) => {
  const userMap = await db.fetchUsers()
  const user = Object.values(userMap).find((u) => u.login === req.body.login)

  if (user == null) return res.status(400).send()

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
      res.status(400).send()
    }
  } catch {
    res.status(500).send()
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

  return res.sendStatus(204)
})

const port = process.env.AUTH_API_PORT

app.listen(port, () => {
  console.log(`Auth API server running at http://localhost:${port}`)
})
