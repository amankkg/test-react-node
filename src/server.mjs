import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {nanoid} from 'nanoid/async'
import dayjs from 'dayjs'
import dotenv from 'dotenv'

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.API_ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.API_REFRESH_TOKEN_SECRET
const API_PORT = process.env.API_PORT

//#region DATA

const refreshTokens = []
const users = [
  {
    id: 'Fqu69F_WSsSqzb1r1Jye1',
    login: 'johndoe',
    password: '$2b$10$hA1r0f4tqe5EoTSTl8kDS.GNqlzfgGZ8JdcuXdiunnevyDtGbMLBK',
  },
]

//#endregion DATA

const app = express()

app.use(express.json())

//#region AUTH

const generateAccessToken = (identity) => {
  const expiresIn = 24 * 60 * 60
  const accessToken = jwt.sign(identity, ACCESS_TOKEN_SECRET, {expiresIn})
  const expireDate = dayjs().add(expiresIn, 'second').toDate()

  return [accessToken, expireDate]
}

const generateRefreshToken = (identity) => {
  return jwt.sign(identity, REFRESH_TOKEN_SECRET)
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, ACCESS_TOKEN_SECRET, (error, identity) => {
    if (error) return res.sendStatus(403)

    req.userId = identity.userId

    next()
  })
}

app.post('/signup', async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)
    const id = await nanoid()

    const user = {id, login: req.body.login, password}

    users.push(user)

    res.status(201).send(user)
  } catch {
    res.status(500).send()
  }
})

app.post('/signin', async (req, res) => {
  const user = users.find((user) => user.login === req.body.login)

  if (user == null) return res.status(404).send()

  try {
    const passwordComparison = bcrypt.compare(req.body.password, user.password)

    if (await passwordComparison) {
      const identity = {userId: user.id}
      const [accessToken, expireDate] = generateAccessToken(identity)
      const refreshToken = generateRefreshToken(identity)

      refreshTokens.push(refreshToken)

      res.status(200).send({accessToken, expireDate, refreshToken})
    } else {
      res.status(400).send()
    }
  } catch {
    res.status(500).send()
  }
})

app.post('/token', (req, res) => {
  const refreshToken = req.body.token

  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, identity) => {
    if (error) return res.sendStatus(403)

    const newIdentity = {userId: identity.userId}
    const [accessToken, expireDate] = generateAccessToken(newIdentity)

    res.json({accessToken, expireDate})
  })
})

app.get('/me', authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId)

  if (user == null) return res.sendStatus(404)

  res.json(user)
})

app.delete('/signout', (req, res) => {
  const tokenIndex = refreshTokens.indexOf(req.body.token)

  if (tokenIndex === -1) return res.sendStatus(404)

  refreshTokens.splice(tokenIndex, 1)

  return res.sendStatus(204)
})

//#endregion

//#region USERS

app.get('/users', authenticateToken, (req, res) => {
  res.json(users)
})

app.get('/users/:id', authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.params.id)

  if (user == null) res.status(404).send()
  else res.json(user)
})

app.post('/users', authenticateToken, async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)
    const id = await nanoid()

    const user = {id, login: req.body.login, password}

    users.push(user)

    res.status(201).send(user)
  } catch {
    res.status(500).send()
  }
})

app.put('/users/:id', authenticateToken, async (req, res) => {
  const user = users.find((u) => u.id === req.params.id)

  const password = await bcrypt.hash(req.body.password, 10)

  if (user != null) {
    user.login = req.body.login
    user.password = password

    res.status(202).send(user)
  } else {
    const user = {id: req.params.id, login: req.body.login, password}

    users.push(user)

    res.status(201).send(user)
  }
})

app.delete('/users/:id', authenticateToken, (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id)

  if (index >= 0) {
    users.splice(-1, 1)

    res.status(204).send()
  } else {
    res.status(404).send()
  }
})

//#endregion

app.listen(API_PORT)
