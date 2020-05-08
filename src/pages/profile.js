import React from 'react'
import {useSelector} from 'react-redux'

export const Profile = () => {
  const state = useSelector((state) => state.account)

  return (
    <div>
      <h1>Account</h1>
      <p>
        <b>Login:</b> {state.login}
      </p>
      <p>
        <b>Registered:</b> {new Date(state.created).toLocaleString()}
      </p>
      <p>
        <b>Role:</b> <code>{state.role}</code>
      </p>
    </div>
  )
}
