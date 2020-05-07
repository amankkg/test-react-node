import {handleActions} from 'redux-actions'

import {account as on} from '../actions'
import {statuses} from '../constants'
import {handleStartedAction, handleFinishedAction} from './helpers'

const defaultState = {
  token: null,
  tokenExpire: null,
  refreshToken: null,
  login: null,
  role: 'guest', // guest | customer | admin
  created: null,
  status: statuses.IDLE,
  error: null,
}

export const account = handleActions(
  {
    [on.signIn.started]: handleStartedAction,
    [on.signIn.finished]: handleFinishedAction,

    [on.signedOut]: () => defaultState,

    [on.fetch.started]: handleStartedAction,
    [on.fetch.finished]: (state, action) => {
      if (action.error)
        return {...state, status: statuses.ERROR, error: action.payload.message}

      const {cart, ...payload} = action.payload

      return {...state, ...payload, status: statuses.OK, error: null}
    },

    [on.tokenRefresh.finished]: (state, action) =>
      handleFinishedAction(action.error ? defaultState : state, action),
  },
  defaultState,
)
