import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory, useLocation, useParams} from 'react-router-dom'

import {statuses} from '../constants'
import {signIn, githubSignIn, googleSignIn} from '../thunks'

const githubLink = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GITHUB_REDIRECT_URI}`
const googleLink = ``

export const SignIn = () => {
  const state = useSelector((state) => ({
    status: state.account.status,
    error: state.account.error,
  }))
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const params = useParams()

  const searchParams = new URLSearchParams(location.search)
  const githubCode =
    params.authServer === 'github' ? searchParams.get('code') : null
  const googleCode =
    params.authServer === 'google' ? searchParams.get('code') : null

  useEffect(() => {
    if (githubCode) {
      window.history.pushState(
        {},
        null,
        window.location.origin + location.pathname,
      )
      dispatch(githubSignIn(githubCode, history))
    }

    if (googleCode) {
      window.history.pushState(
        {},
        null,
        window.location.origin + location.pathname,
      )
      dispatch(googleSignIn(googleCode, history))
    }
  }, [githubCode, googleCode, location.pathname, history, dispatch])

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
      <a href={googleLink}>
        <span>via Google</span>
      </a>
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
