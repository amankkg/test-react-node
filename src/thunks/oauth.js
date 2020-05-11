import * as actions from '../actions'
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

  await storage.write(process.env.REACT_APP_IDENTITY_STORAGE_KEY, payload)

  dispatch(finished(payload))
  dispatch(fetchMe())
  history.push('/')
}

export const googleSignIn = (code, history) => async (dispatch) => {}
