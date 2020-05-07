import * as actions from '../actions'
import {timeout} from './helpers'

export const fetchProductList = () => async (dispatch) => {
  dispatch(actions.products.fetch.started())
  // const response = await fetch('/api/products')
  // const items = await response.json()

  // TODO: use real data
  const entries = {
    1: {id: '1', title: 'Cake', price: 42, quantity: 5},
    2: {id: '2', title: 'Ice Cream', price: 17, quantity: 8},
  }

  await timeout(1000)

  dispatch(actions.products.fetch.finished({entries}))
}
