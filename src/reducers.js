import {handleActions} from 'redux-actions'

import * as actions from './actions'

const defaultCartState = {
  entries: {},
  promoCode: '',
  message: null,
  status: 0, // -1 - fetch error, 0 - idle, 1 - fetching, 2 - fetched
}

export const cart = handleActions(
  {
    [actions.addToCart](state, action) {
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

    [actions.updateQuantity](state, action) {
      const {id, value} = action.payload

      if (id in state.entries) {
        const entries = {...state.entries, [id]: value}

        return {...state, entries}
      }

      return state
    },

    [actions.deleteEntry](state, action) {
      const entries = {...state.entries}

      delete entries[action.payload.id]

      return {...state, entries}
    },

    [actions.fetchCartStart]: (state) => ({...state, status: 1}),

    [actions.fetchCartSuccess](state, action) {
      const {entries, promoCode} = action.payload

      return {
        ...state,
        entries,
        promoCode,
        status: 2,
      }
    },

    [actions.processCart]: (state) => ({
      ...state,
      message: defaultCartState.message,
      promoCode: defaultCartState.promoCode,
      entries: defaultCartState.entries,
    }),

    [actions.fetchCartFail](state, action) {
      const {message} = action.payload

      return {...state, message, status: -1}
    },
  },
  defaultCartState,
)

const defaultProductListState = {
  entries: {}, // [id]: {...product}
  message: null,
  status: 0, // -1 - fetch error, 0 - idle, 1 - fetching, 2 - fetched
}

export const productList = handleActions(
  {
    [actions.processCart](state, action) {
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

    [actions.fetchProductListStart]: (state) => ({
      ...state,
      status: 1,
    }),

    [actions.fetchProductListSuccess]: (state, action) => ({
      ...state,
      entries: action.payload.entries,
      status: 2,
    }),

    [actions.fetchProductListFail]: (state, action) => ({
      ...state,
      status: -1,
      message: action.payload.message,
    }),
  },
  defaultProductListState,
)
