import {handleActions} from 'redux-actions'

import * as on from '../actions'
import {statuses} from '../constants'
import {handleStartedAction, handleFinishedAction} from './helpers'

const defaultState = {
  entries: {},
  status: statuses.IDLE,
  error: null,
}

export const products = handleActions(
  {
    [on.products.fetch.started]: handleStartedAction,
    [on.products.fetch.finished]: handleFinishedAction,

    [on.cart.purchase.finished]: (state, action) => {
      if (action.error) return state

      const entries = {...state.entries}

      for (const [id, value] of Object.entries(action.payload.entries)) {
        if (id in entries) {
          const {quantity, ...entry} = entries[id]

          entry.quantity -= value
          entries[id] = entry
        }
      }

      return {...state, entries}
    },
  },
  defaultState,
)
