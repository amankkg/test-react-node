export async function read(key) {
  await null

  return JSON.parse(localStorage.getItem(key))
}

export async function write(key, value) {
  await null

  localStorage.setItem(key, JSON.stringify(value))
}
