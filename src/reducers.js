import {handleActions} from 'redux-actions'

import * as actions from './actions'

const defaultCartState = {
  entries: {},
  promoCode: null,
  message: null,
  status: 1, // -1 - loading error, 0 - loading, 1 - ok
}

export const cart = (state = defaultCartState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const {id, quantity} = action.payload
      const nextState = {
        ...state,
        entries: {
          ...state.entries,
          [id]: quantity,
        },
      }

      return nextState
    }
    case 'UPDATE_QUANTITY': {
      const {id, quantity} = action.payload

      if (id in state.entries) {
        const nextState = {
          ...state,
          entries: {
            ...state.entries,
            [id]: quantity,
          },
        }

        return nextState
      }

      return state
    }
    case 'DELETE_ENTRY': {
      const entries = Object.entries(state.entries)
        .filter(([id, quantity]) => id !== action.payload.id)
        .reduce(
          (accumulate, [id, quantity]) => ({...accumulate, [id]: quantity}),
          {},
        )

      const nextState = {...state, entries}

      return nextState
    }
    case 'FETCH_CART_PENDING': {
      return {...state, status: 0}
    }
    case 'FETCH_CART_SUCCESS': {
      const {entries, promoCode} = action.payload
      return {
        ...state,
        entries,
        promoCode,
        status: 1,
      }
    }
    case 'FETCH_CART_FAIL': {
      const {message} = action.payload

      return {...state, message, status: -1}
    }
    default:
      return state
  }
}

const defaultProductListState = {
  entries: {}, // [id]: {...product}
  message: null,
  status: 1, // -1 - fetch error, 0 - fetching, 1 - ok
}

export const productList = handleActions(
  {
    [actions.processCart](state, {payload}) {
      const entries = {...state.entries}

      for (const [id, quantity] of Object.entries(payload)) {
        if (id in entries) entries[id] -= quantity
      }

      return {...state, entries}
    },

    [actions.fetchProductListPending](state, {payload}) {
      return {...state, status: 0}
    },

    [actions.fetchProductListSuccess](state, {payload}) {
      return {...state, entries: payload, status: 1}
    },

    [actions.fetchProductListFail](state, {payload}) {
      return {...state, status: -1, message: payload}
    },
  },
  defaultProductListState,
)
