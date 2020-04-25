import express from 'express'
import {nanoid} from 'nanoid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())

// TODO: implement token refresh, Single Sign-On/In
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(
    token,
    process.env.REACT_APP_API_ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.sendStatus(403)

      req.userId = user.userId

      next()
    },
  )
}

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.get('/users/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id)

  if (user == null) res.status(404).send()
  else res.json(user)
})

app.post('/users', async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10)

    const user = {id: nanoid(), login: req.body.login, password}

    users.push(user)

    res.status(201).send(user)
  } catch {
    res.status(500).send()
  }
})

app.put('/users/:id', async (req, res) => {
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

app.delete('/users/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id)

  if (index >= 0) {
    users.splice(-1, 1)

    res.status(204).send()
  } else {
    res.status(404).send()
  }
})

app.post('/login', async (req, res) => {
  const user = users.find((user) => user.login === req.body.login)

  if (user == null) {
    return res.status(404).send()
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const identity = {userId: user.id}
      const accessToken = jwt.sign(
        identity,
        process.env.REACT_APP_API_ACCESS_TOKEN_SECRET,
      )

      res.status(200).send({accessToken})
    } else {
      res.status(400).send()
    }
  } catch {
    res.status(500).send()
  }
})

app.get('/me', authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId)

  res.json(user)
})

app.listen(process.env.REACT_APP_API_PORT)
