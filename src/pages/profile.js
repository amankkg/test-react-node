import React from 'react'
import {useSelector} from 'react-redux'

export const Profile = () => {
  const state = useSelector((state) => state.account)

  return (
    <div>
      <h1>Account</h1>
      <p>Login: {state.login}</p>
      <p>Registered: {state.created}</p>
      <p>Role: {state.role}</p>
    </div>
  )
}
