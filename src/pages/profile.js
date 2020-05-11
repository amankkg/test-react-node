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
      {state.login.startsWith('github:') && (
        <p>
          <a
            href={
              'https://github.com/settings/connections/applications/' +
              process.env.REACT_APP_GITHUB_CLIENT_ID
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Review permissions
          </a>
        </p>
      )}
    </div>
  )
}
