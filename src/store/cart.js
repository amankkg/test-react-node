import {handleActions} from 'redux-actions'

import * as on from '../actions'
import {statuses} from '../constants'
import {handleStartedAction, handleFinishedAction} from './helpers'

const defaultState = {
  entries: {},
  promoCode: '',
  purchaseStatus: statuses.IDLE,
}

export const cart = handleActions(
  {
    [on.cart.entryAdded]: ({...state}, {payload: {id, quantity}}) => {
      state.entries = {...state.entries}
      state.entries[id] = quantity + (state.entries[id] ?? 0)

      return state
    },

    [on.cart.entryUpdated]: ({...state}, {payload: {id, quantity}}) => {
      state.entries = {...state.entries, [id]: quantity}

      return state
    },

    [on.cart.entryRemoved]: ({...state}, {payload: {id}}) => {
      state.entries = {...state.entries}

      delete state.entries[id]

      return state
    },

    [on.cart.promoUpdated]: (state, {payload: {value}}) => ({
      ...state,
      promoCode: value,
    }),

    [on.cart.purchase.started]: (state, action) => {
      const {status, ...nextState} = handleStartedAction(state)

      nextState.purchaseStatus = status

      return nextState
    },

    [on.cart.purchase.finished]: (state, action) => {
      const {status, ...nextState} = handleFinishedAction(state, action)

      nextState.purchaseStatus = status

      return nextState
    },

    [on.account.signedOut]: () => defaultState,
  },
  defaultState,
)
