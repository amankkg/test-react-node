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
    [on.cart.entryAdded]: (state, {payload: {id, quantity}}) => {
      const nextState = {
        ...state,
        entries: {
          ...state.entries,
          [id]: quantity + (state.entries[id] ?? 0),
        },
      }

      return nextState
    },

    [on.cart.entryUpdated]: (state, {id, quantity}) => ({
      ...state,
      entries: {...state.entries, [id]: quantity},
    }),

    [on.cart.entryRemoved]: (state, {payload: {id}}) => {
      const entries = {...state.entries}

      delete entries[id]

      return {...state, entries}
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
