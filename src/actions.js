import {createActions} from 'redux-actions'

const asyncActions = {
  STARTED: undefined,
  FINISHED: undefined,
}

export const {account, cart, products} = createActions({
  ACCOUNT: {
    FETCH: asyncActions,
    SIGN_IN: asyncActions,
    SIGN_UP: asyncActions,
    SIGNED_OUT: undefined,
    TOKEN_REFRESH: asyncActions,
  },
  CART: {
    ENTRY_ADDED: (id, quantity) => ({id, quantity}),
    ENTRY_UPDATED: (id, quantity) => ({id, quantity}),
    ENTRY_REMOVED: (id) => ({id}),
    PROMO_UPDATED: (value) => ({value}),
    PURCHASE: asyncActions,
  },
  PRODUCTS: {
    FETCH: asyncActions,
  },
})
