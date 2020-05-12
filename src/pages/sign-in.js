import React, {useState, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory, useLocation, useParams} from 'react-router-dom'

import * as actions from '../actions'
import {statuses} from '../constants'
import {signIn, githubSignIn, googleSignIn} from '../thunks'

const githubLink = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GITHUB_REDIRECT_URI}`

export const SignIn = () => {
  const state = useSelector((state) => state.account)
  const googleAuth = useRef(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const params = useParams()

  const searchParams = new URLSearchParams(location.search)
  const githubCode =
    params.authServer === 'github' ? searchParams.get('code') : null

  const viaGoogle = () => dispatch(googleSignIn(googleAuth.current, history))

  useEffect(() => {
    if (githubCode) {
      window.history.pushState(
        {},
        null,
        window.location.origin + location.pathname,
      )
      dispatch(githubSignIn(githubCode, history))
    } else {
      try {
        window.gapi.load('auth2', () => {
          googleAuth.current = window.gapi.auth2.init({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          })
        })
      } catch (error) {
        dispatch(actions.account.signInGoogle.finished(error))
      }
    }
  }, [githubCode, location.pathname, history, dispatch])

  const onSubmit = (event) => {
    event.preventDefault()
    dispatch(signIn(login, password, history))
  }

  return (
    <div>
      <h1>Sign In</h1>
      <a href={githubLink}>
        <span>via GitHub</span>
      </a>
      <br />
      <button id="googleSignInButton" onClick={viaGoogle}>
        via Google
      </button>
      <p>or</p>
      <form onSubmit={onSubmit}>
        <label htmlFor="login">Login</label>
        <input
          id="login"
          onChange={(e) => setLogin(e.currentTarget.value)}
          defaultValue={login}
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          defaultValue={password}
          type="password"
          required
        />
        <br />
        {state.status === statuses.PENDING && <p>loading...</p>}
        {state.status === statuses.ERROR && (
          <p className="error">{state.error}</p>
        )}
        <button>Sign In</button>
      </form>
    </div>
  )
}
