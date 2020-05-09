import {handleActions} from 'redux-actions'

import * as on from '../actions'
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
    [on.account.signIn.started]: handleStartedAction,
    [on.account.signIn.finished]: handleFinishedAction,

    [on.account.signUp.started]: handleStartedAction,
    [on.account.signUp.finished]: ({...state}, action) => {
      state.status = action.error ? statuses.ERROR : statuses.IDLE
      state.error = action.error ? action.payload.message : null

      return state
    },

    [on.account.signedOut]: () => defaultState,

    [on.account.fetch.started]: handleStartedAction,
    [on.account.fetch.finished]: (state, action) => {
      if (action.error)
        return {...state, status: statuses.ERROR, error: action.payload.message}

      const {cart, ...payload} = action.payload

      return {...state, ...payload, status: statuses.OK, error: null}
    },

    [on.account.tokenRefresh.finished]: (state, action) =>
      handleFinishedAction(action.error ? defaultState : state, action),
  },
  defaultState,
)
