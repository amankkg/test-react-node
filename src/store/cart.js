import {handleActions} from 'redux-actions'

import * as on from '../actions'

const defaultState = {
  entries: {},
  promoCode: '',
}

export const cart = handleActions(
  {
    [on.cart.addTo]: (state, action) => {
      const {id, quantity} = action.payload
      const nextState = {
        ...state,
        entries: {
          ...state.entries,
          [id]: quantity + (state.entries[id] ?? 0),
        },
      }

      return nextState
    },

    [on.cart.updateEntry]: (state, action) => {
      const {id, value} = action.payload

      if (id in state.entries) {
        const entries = {...state.entries, [id]: value}

        return {...state, entries}
      }

      return state
    },

    [on.cart.deleteEntry]: (state, action) => {
      const entries = {...state.entries}

      delete entries[action.payload.id]

      return {...state, entries}
    },

    [on.cart.updatePromo]: (state, action) => ({
      ...state,
      promoCode: action.payload.promoCode,
    }),

    [on.account.purchase.ok]: () => defaultState,
  },
  defaultState,
)
