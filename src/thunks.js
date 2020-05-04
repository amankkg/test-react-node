import * as actions from './actions'

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchProductList = () => async (dispatch) => {
  dispatch(actions.fetchProductListStart())
  // const response = await fetch('/api/products')
  // const items = await response.json()

  // TODO: use real data
  const items = {
    1: {id: '1', title: 'Cake', price: 42, quantity: 5},
    2: {id: '2', title: 'Ice Cream', price: 17, quantity: 8},
  }

  await timeout(1000)

  dispatch(actions.fetchProductListSuccess(items))
}

export const fetchCart = () => async (dispatch) => {
  dispatch(actions.fetchCartStart())
  // const response = await fetch('/api/cart')
  // const entries = await response.json()

  // TODO: use real data
  const entries = {1: 5}
  const promoCode = ''

  await setTimeout(1000)

  dispatch(actions.fetchCartSuccess(entries, promoCode))
}
