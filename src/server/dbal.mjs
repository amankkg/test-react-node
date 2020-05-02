import path from 'path'
import {promises as fs} from 'fs'

const dbFilePath = path.join('./src/server/db.json')

export async function fetchDb() {
  const content = await fs.readFile(dbFilePath)
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
