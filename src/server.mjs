import path from 'path'
import {promises as fs} from 'fs'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {nanoid} from 'nanoid/async'
import dayjs from 'dayjs'
import dotenv from 'dotenv'

dotenv.config()

//#region DATA
const dbFilePath = path.join('db.json')

async function fetchDb() {
  const content = await fs.readFile(dbFilePath)
  const data = JSON.parse(content)

  return data
}

async function updateDb(data) {
  const content = JSON.stringify(data)

  await fs.writeFile(dbFilePath, content)
}

async function fetchUsers() {
  const db = await fetchDb()

  return db.users
}

async function updateUsers(userMap) {
  const db = await fetchDb()

  db.users = userMap

  await updateDb(db)
}

async function checkRefreshToken(token) {
  const db = await fetchDb()

  return db.refreshTokens.includes(token)
}

async function appendRefreshToken(token) {
  const db = await fetchDb()

  db.refreshTokens.push(token)

  await updateDb(db)
}

async function removeRefreshToken(token) {
  const db = await fetchDb()

  db.refreshTokens = db.refreshTokens.filter((t) => t !== token)

  await updateDb(db)
}

//#endregion DATA

const app = express()

app.use(express.json())

//#region AUTH
const accessTokenSecret = process.env.ACCESS_TOKEN
const refreshTokenSecret = process.env.REFRESH_TOKEN
const expiresIn = parseInt(process.env.TOKEN_TTL)

function generateAccessToken(identity) {
  const accessToken = jwt.sign(identity, accessTokenSecret, {expiresIn})
  const expireDate = dayjs().add(expiresIn, 'second').toDate()

  return [accessToken, expireDate]
}

function generateRefreshToken(identity) {
  return jwt.sign(identity, refreshTokenSecret)
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, accessTokenSecret, (error, identity) => {
    if (error != null) return res.sendStatus(403).send(error.message)

    req.userId = identity.userId

    next()
  })
}

app.post('/signup', async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)
    const id = await nanoid()
    const userMap = await fetchUsers()
    const user = {id, login: req.body.login, password, created: new Date()}

    userMap[id] = user

    await updateUsers(userMap)

    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/signin', async (req, res) => {
  const userMap = await fetchUsers()
  const user = Object.values(userMap).find((u) => u.login === req.body.login)

  if (user == null) return res.status(404).send()

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

      await appendRefreshToken(refreshToken)

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

  const exists = await checkRefreshToken(refreshToken)

  if (!exists) return res.sendStatus(403)

  jwt.verify(refreshToken, refreshTokenSecret, (error, identity) => {
    if (error) return res.sendStatus(403)

    const newIdentity = {userId: identity.userId}
    const [accessToken, expireDate] = generateAccessToken(newIdentity)
    const payload = {accessToken, expireDate}

    res.json(payload)
  })
})

app.get('/me', authenticateToken, async (req, res) => {
  const userMap = await fetchUsers()

  const user = userMap[req.userId]

  if (user == null) return res.sendStatus(404)

  delete user.password

  res.json(user)
})

app.delete('/signout', async (req, res) => {
  await removeRefreshToken(req.body.token)

  return res.sendStatus(204)
})

//#endregion

//#region USERS

app.get('/users', authenticateToken, async (req, res) => {
  const userMap = await fetchUsers()

  res.json(userMap)
})

app.get('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await fetchUsers()

  const user = userMap[req.params.id]

  if (user == null) res.status(404).send()
  else res.json(user)
})

app.post('/users', authenticateToken, async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)
    const id = await nanoid()
    const userMap = await fetchUsers()
    const user = {id, login: req.body.login, password, created: new Date()}

    userMap[id] = user

    await updateUsers(userMap)

    res.status(201).send(user)
  } catch {
    res.status(500).send()
  }
})

app.put('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await fetchUsers()
  const user = userMap[req.params.id]
  const password = await bcrypt.hash(req.body.password, 10)

  if (user != null) {
    user.login = req.body.login
    user.password = password

    res.status(202).send(user)
  } else {
    const user = {id: req.params.id, login: req.body.login, password}

    userMap[req.params.id] = user

    await updateUsers(userMap)

    res.status(201).send(user)
  }
})

app.delete('/users/:id', authenticateToken, async (req, res) => {
  const userMap = await fetchUsers()

  if (req.params.id in userMap) {
    delete userMap[req.params.id]

    await updateUsers(userMap)

    res.status(204).send()
  } else {
    res.status(404).send()
  }
})

//#endregion

const port = process.env.API_PORT

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})
