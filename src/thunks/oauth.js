import * as actions from '../actions'
import {routes} from '../constants'
import {request, storage} from '../services'
import {fetchMe} from './account'

export const githubSignIn = (code, history) => async (dispatch) => {
  const {started, finished} = actions.account.signInGithub
  let payload

  dispatch(started())

  try {
    const body = {
      code,
      clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
      redirectUri: process.env.REACT_APP_GITHUB_REDIRECT_URI,
    }

    const data = await request.auth('/signin/github', {method: 'post', body})

    payload = {
      token: data.accessToken,
      tokenExpire: data.expireDate,
      refreshToken: data.refreshToken,
    }
  } catch (error) {
    return dispatch(finished(error))
  }

  await storage.write(process.env.REACT_APP_STORAGE_KEY, payload)

  dispatch(finished(payload))
  dispatch(fetchMe())
  history.push(routes.HOME)
}

export const googleSignIn = (gapiAuth2, history) => async (dispatch) => {
  const {started, finished} = actions.account.signInGoogle

  if (gapiAuth2 == null) {
    return dispatch(finished(new Error('Google Auth API not initialized yet')))
  }

  dispatch(started())

  let idToken

  try {
    const user = await gapiAuth2.signIn()

    idToken = user.getAuthResponse().id_token
  } catch (error) {
    return dispatch(finished(error))
  }

  let payload

  try {
    const data = await request.auth('/signin/google', {
      method: 'post',
      body: {idToken, clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID},
    })

    payload = {
      token: data.accessToken,
      tokenExpire: data.expireDate,
      refreshToken: data.refreshToken,
    }
  } catch (error) {
    return dispatch(finished(error))
  }

  await storage.write(process.env.REACT_APP_STORAGE_KEY, payload)

  dispatch(finished(payload))
  dispatch(fetchMe())
  history.push(routes.HOME)
}
