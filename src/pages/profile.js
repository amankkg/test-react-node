import React, {useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'

import {signOut} from '../thunks'

export const Profile = () => {
  const {login, role, created} = useSelector((state) => state.account)
  const googleAuth = useRef(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const viaGoogle = login.startsWith('google:')
  const viaGithub = login.startsWith('github:')

  const onSignOutClick = () => {
    if (viaGoogle && googleAuth.current != null) {
      googleAuth.current.signOut().catch((error) => console.error(error))
    }

    dispatch(signOut(history))
  }

  useEffect(() => {
    if (!viaGoogle) return

    try {
      window.gapi.load('auth2', () => {
        googleAuth.current = window.gapi.auth2.init({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        })
      })
    } catch (error) {
      console.error(error)
    }
  }, [viaGoogle])

  return (
    <div>
      <h1>Account</h1>
      <p>
        <b>Login:</b> {login}
      </p>
      <p>
        <b>Registered:</b> {new Date(created).toLocaleString()}
      </p>
      <p>
        <b>Role:</b> <code>{role}</code>
      </p>
      <button onClick={onSignOutClick}>sign out</button>
      {viaGithub && (
        <p>
          <a
            href={
              'https://github.com/settings/connections/applications/' +
              process.env.REACT_APP_GITHUB_CLIENT_ID
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub: review or revoke my permissions
          </a>
        </p>
      )}
    </div>
  )
}
