import * as actions from '../actions'
import {request, storage} from '../services'

export const signIn = (login, password, history) => async (dispatch) => {
  const {started, finished} = actions.account.signIn
  let payload

  dispatch(started())

  try {
    const options = {method: 'post', body: {login, password}}

    const data = await request.auth('/signin', options)

    payload = {
      token: data.accessToken,
      tokenExpire: data.expireDate,
      refreshToken: data.refreshToken,
    }
  } catch (error) {
    return dispatch(finished(error))
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
  const token = getState().account.refreshToken

  dispatch(actions.account.signedOut())

  try {
    await request.auth('/signout', {method: 'delete', body: {token}})
  } catch (error) {
    console.error(error)
  }

  history.push('/')
}

export const fetchMe = () => async (dispatch, getState) => {
  const {started, finished} = actions.account.fetch
  const {token} = getState().account
  let payload

  dispatch(started())

  try {
    payload = await request.api('/me', {token})
  } catch (error) {
    payload = error
  }

  dispatch(finished(payload))
}
