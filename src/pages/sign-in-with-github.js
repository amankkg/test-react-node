import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'

import * as actions from '../actions'
import {statuses} from '../constants'
import {request} from '../services'

const redirectUri = process.env.REACT_APP_GITHUB_REDIRECT_URI
const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID
const githubLink = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}&redirect_uri=${redirectUri}`

export const SignInWithGithub = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.account)
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const code = searchParams.get('code')

  useEffect(() => {
    if (!code) return

    async function load() {
      const {started, finished} = actions.account.signInGithub

      window.history.pushState(
        {},
        null,
        window.location.origin + location.pathname,
      )

      dispatch(started())
      debugger
      try {
        const {token, scope, tokenType} = await request.auth('/signin/github', {
          method: 'post',
          body: {clientId, redirectUri, code},
        })

        const user = await request(
          `https://api.github.com/user?scope=${scope}&token_type=${tokenType}`,
          {token},
        )

        const github = {user, token, scope, tokenType}

        dispatch(finished({github}))
      } catch (error) {
        dispatch(finished(error))
      }
    }

    load()
  }, [code, dispatch, location.pathname])

  return (
    <div>
      <h1>Sign In with GitHub</h1>
      <a href={githubLink}>
        <span>Login with GitHub</span>
      </a>
      {state.status === statuses.PENDING && <p>loading...</p>}
      {state.status === statuses.ERROR && (
        <p className="error">{state.error}</p>
      )}
    </div>
  )
}
