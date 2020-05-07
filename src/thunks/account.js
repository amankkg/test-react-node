import * as actions from '../actions'
import {request, storage} from '../services'

export const signIn = (login, password, history) => async (dispatch) => {
  const {started, finished} = actions.account.signIn

  dispatch(started())

  const response = await fetch(process.env.REACT_APP_AUTH_API_URL + '/signin', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({login, password}),
  })

  if (!response.ok) {
    const payload = new Error(response.statusText)

    return dispatch(finished(payload))
  }

  const tokens = await response.json()

  const payload = {
    token: tokens.accessToken,
    tokenExpire: tokens.expireDate,
    refreshToken: tokens.refreshToken,
  }

  await storage.write(process.env.REACT_APP_IDENTITY_STORAGE_KEY, payload)

  dispatch(finished(payload))
  dispatch(fetchMe())
  history.push('/')
}

export const signUp = (login, password, history) => async (dispatch) => {
  const {started, finished} = actions.account.signUp

  dispatch(started())

  try {
    await request.auth('/signup', {method: 'post', body: {login, password}})
  } catch (error) {
    return dispatch(finished(error))
  }

  dispatch(finished())
  history.push('/signin')
}

export const signOut = (history) => async (dispatch, getState) => {
  dispatch(actions.account.signedOut())

  const state = getState()

  const response = await fetch(
    process.env.REACT_APP_AUTH_API_URL + '/signout',
    {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token: state.account.refreshToken}),
    },
  )

  if (!response.ok) console.error(new Error(response.statusText))

  history.push('/')
}

export const fetchMe = (history) => async (dispatch, getState) => {
  const {started, finished} = actions.account.fetch
  const state = getState()

  dispatch(started())

  // TODO: create a middleware to check for token + expire date
  const needNewToken =
    state.account.token == null ||
    Date.parse(state.account.tokenExpire) < Date.now()

  if (needNewToken) return history.push('/signin')

  const response = await fetch(process.env.REACT_APP_MAIN_API_URL + '/me', {
    headers: {Authorization: 'Bearer ' + state.account.token},
  })

  if (!response.ok) {
    const payload = new Error(response.statusText)

    return dispatch(finished(payload))
  }

  const account = await response.json()

  dispatch(finished(account))
}
