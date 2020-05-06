import {createActions} from 'redux-actions'

const messagePayload = (message) => ({message})

export const {cart, products, account} = createActions({
  ACCOUNT: {
    PURCHASE: {
      START: undefined,
      OK: (entries) => ({entries}),
      FAIL: messagePayload,
    },
    FETCH: {
      START: undefined,
      OK: (profile) => ({profile}),
      FAIL: messagePayload,
    },
    SIGN_IN: {
      START: undefined,
      OK: (refreshToken, accessToken, expireDate) => ({
        refreshToken,
        accessToken,
        expireDate,
      }),
      FAIL: messagePayload,
    },
  },
  CART: {
    ADD_TO: (id, quantity) => ({id, quantity}),
    UPDATE_ENTRY: (id, quantity) => ({id, quantity}),
    DELETE_ENTRY: (id) => ({id}),
    UPDATE_PROMO: (promoCode) => ({promoCode}),
  },
  PRODUCTS: {
    FETCH: {
      START: undefined,
      OK: (entries) => ({entries}),
      FAIL: messagePayload,
    },
  },
})
