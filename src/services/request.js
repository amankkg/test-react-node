class FetchError extends Error {
  constructor(response) {
    super('Fetch error. ' + response.statusText)

    this.statusCode = response.status
    this.wasRedirected = response.redirected
    this.responseType = response.type
    this.url = response.url
  }
}

export async function request(url, {method, body, token, search}) {
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

  if (!response.ok) throw new FetchError(response)

  if (response.headers.get('Content-Type') === 'application/json')
    return await response.json()
}

request.auth = (authEndpoint, {method, body, token, search}) =>
  request(process.env.REACT_APP_AUTH_API_URL + authEndpoint, {
    method,
    body,
    token,
    search,
  })

request.api = (mainEndpoint, {method, body, token, search}) =>
  request(process.env.REACT_APP_MAIN_API_URL + mainEndpoint, {
    method,
    body,
    token,
    search,
  })
