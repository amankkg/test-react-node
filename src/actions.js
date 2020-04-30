import {createAction} from 'redux-actions'

export const processCart = createAction('PROCESS_CART')
export const fetchProductListPending = createAction(
  'FETCH_PRODUCT_LIST_PENDING',
)
export const fetchProductListSuccess = createAction(
  'FETCH_PRODUCT_LIST_SUCCESS',
)
export const fetchProductListFail = createAction('FETCH_PRODUCT_LIST_FAIL')
