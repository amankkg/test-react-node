class FetchError extends Error {
  constructor(response, payload) {
    super(payload?.message ?? response.statusText)

    this.statusCode = response.status
    this.wasRedirected = response.redirected
    this.responseType = response.type
    this.url = response.url
    this.data = payload?.data
  }
}

export async function request(url, {method, body, token, search} = {}) {
  const options = {headers: new Headers()}

  if (method) {
    options.method = method
  }

  if (body) {
    options.body = JSON.stringify(body)
    options.headers.append('Content-Type', 'application/json')
  }

  if (token) {
    options.headers.append('Authorization', 'Bearer ' + token)
  }

  if (search) {
    url += '?' + new URLSearchParams(search).toString()
  }

  const response = await fetch(url, options)

  let payload

  if (response.headers.get('Content-Type')?.startsWith('application/json')) {
    payload = await response.json()
  }

  if (!response.ok) throw new FetchError(response, payload)

  return payload
}

request.auth = (authEndpoint, ...rest) =>
  request(process.env.REACT_APP_AUTH_API_URL + authEndpoint, ...rest)

request.api = (mainEndpoint, ...rest) =>
  request(process.env.REACT_APP_MAIN_API_URL + mainEndpoint, ...rest)
