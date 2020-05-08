import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'

import {statuses} from '../constants'
import {signIn} from '../thunks'

export const SignIn = () => {
  const state = useSelector((state) => ({
    status: state.account.status,
    error: state.account.error,
  }))
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const onSubmit = (event) => {
    event.preventDefault()
    dispatch(signIn(login, password, history))
  }

  return (
    <div>
      <h1>Sign In</h1>
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
