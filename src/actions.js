import {createAction} from 'redux-actions'

//#region PRODUCT LIST
export const processCart = createAction('PROCESS_CART', (entries) => ({
  entries,
}))

export const fetchProductListStart = createAction('FETCH_PRODUCT_LIST_PENDING')

export const fetchProductListSuccess = createAction(
  'FETCH_PRODUCT_LIST_SUCCEEDED',
  (entries) => ({entries}),
)

export const fetchProductListFail = createAction(
  'FETCH_PRODUCT_LIST_FAILED',
  (message) => ({message}),
)
//#endregion

//#region CART
export const addToCart = createAction('ADD_TO_CART', (id, quantity) => ({
  id,
  quantity,
}))

export const updateQuantity = createAction('UDPATE_QUANTITY', (id, value) => ({
  id,
  value,
}))

export const deleteEntry = createAction('DELETE_ENTRY', (id) => ({id}))

export const fetchCartStart = createAction('FETCH_CART_PENDING')

export const fetchCartSuccess = createAction(
  'FETCH_CART_SUCCEEDED',
  (entries, promoCode) => ({entries, promoCode}),
)

export const fetchCartFail = createAction('FETCH_CART_FAILED', (message) => ({
  message,
}))
//#endregion
