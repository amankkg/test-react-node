import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useHistory, useLocation} from 'react-router-dom'

import * as actions from '../actions'
import {storage} from '../services'
import {fetchMe} from '../thunks'
import {routes} from '../constants'

export function useRestoreSession() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    if (restored) return

    async function restore() {
      const tokens = await storage.read(
        process.env.REACT_APP_IDENTITY_STORAGE_KEY,
      )

      if (tokens && Date.parse(tokens.tokenExpire) > Date.now()) {
        dispatch(actions.account.signIn.finished(tokens))
        dispatch(fetchMe())

        if (location.pathname.startsWith(routes.SIGNIN)) history.push('/')
      }

      setTimeout(setRestored, 250, true)
    }

    restore()
  }, [restored, location.pathname, history, dispatch])

  return restored
}
