import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'

import {statuses} from '../constants'
import {signUp} from '../thunks'

export const SignUp = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const {status, error} = useSelector((state) => state.account)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    dispatch(signUp(login, password, history))
  }

  const passwordMismatch = password !== '' && password !== passwordConfirm

  return (
    <div>
      <h1>Sign Up</h1>
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
        <label htmlFor="password-confirm">Confirm password</label>
        <input
          id="password-confirm"
          onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
          defaultValue={passwordConfirm}
          type="password"
          required
        />
        <br />
        {passwordMismatch && (
          <p className="error">password and confirm password should match</p>
        )}
        {status === statuses.PENDING && <p>loading...</p>}
        {status === statuses.ERROR && <p className="error">{error}</p>}
        <button>Sign Up</button>
      </form>
    </div>
  )
}
