import path from 'path'
import {promises as fs} from 'fs'

const dbFilePath = path.join('./temp-db.json')

async function initDb() {
  const seed = {
    users: {},
    products: {},
    refreshTokens: [],
  }

  // prettier-ignore
  const admin = {id: 'TXMjtxFmGOKN0-Gml9heg', login: 'admin', password: '$2b$10$mXmvTWVivhb0ryS/rAxz1u/fbBe/ledwxLcGnHW6kfNoPjiu6vAaq', role: 'admin', cart: {}, created: new Date()}
  // prettier-ignore
  const milk = {id: 'aefEjtxFmGOKN0-Gm3214g', title: 'Milk, 1000 ml', price: 5, quantity: 50}
  // prettier-ignore
  const cornFlakes = {id: 'sefSELJIfseli-laef314g', title: 'Corn Flakes, 750 g', price: 13, quantity: 50}
  // prettier-ignore
  const cookie = {id: 'uyc53APOIs-432kjh8ef', title: 'Cookie, 450 g', price: 11, quantity: 50}

  seed.users[admin.id] = admin
  seed.products[milk.id] = milk
  seed.products[cornFlakes.id] = cornFlakes
  seed.products[cookie.id] = cookie

  await fs.writeFile(dbFilePath, JSON.stringify(seed))
}

export async function fetchDb() {
  let content
  
  try {
    content = await fs.readFile(dbFilePath)
  } catch (error) {
    await initDb()

    content = await fs.readFile(dbFilePath)
  }
  
  const data = JSON.parse(content)

  return data
}

export async function updateDb(data) {
  const content = JSON.stringify(data)

  await fs.writeFile(dbFilePath, content)
}

export async function fetchUsers() {
  const db = await fetchDb()

  return db.users
}

export async function updateUsers(userMap) {
  const db = await fetchDb()

  db.users = userMap

  await updateDb(db)
}

export async function checkRefreshToken(token) {
  const db = await fetchDb()

  return db.refreshTokens.includes(token)
}

export async function appendRefreshToken(token) {
  const db = await fetchDb()

  db.refreshTokens.push(token)

  await updateDb(db)
}

export async function removeRefreshToken(token) {
  const db = await fetchDb()

  db.refreshTokens = db.refreshTokens.filter((t) => t !== token)

  await updateDb(db)
}
