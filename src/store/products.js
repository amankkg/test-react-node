import {handleActions} from 'redux-actions'

import * as on from '../actions'

const defaultState = {
  entries: {},
  message: null,
  status: 0, // -1 - fetch error, 0 - idle, 1 - fetching, 2 - fetched
}

export const productList = handleActions(
  {
    [on.account.purchase.ok]: (state, action) => {
      const entries = {...state.entries}

      for (const [id, value] of Object.entries(action.payload.entries)) {
        if (id in entries) {
          const {quantity, ...entry} = entries[id]

          entry.quantity = quantity - value

          if (entry.quantity <= 0) delete entries[id]
          else entries[id] = entry
        }
      }

      return {...state, entries}
    },

    [on.products.fetch.start]: (state) => ({
      ...state,
      status: 1,
    }),

    [on.products.fetch.ok]: (state, action) => ({
      ...state,
      entries: action.payload.entries,
      status: 2,
    }),

    [on.products.fetch.fail]: (state, action) => ({
      ...state,
      status: -1,
      message: action.payload.message,
    }),
  },
  defaultState,
)
