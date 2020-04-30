import {fetchProductListSuccess} from './actions'

export const fetchProductList = () => async (dispatch) => {
  // const response = await fetch('/api/products')
  // const items = await response.json()

  // TODO: use real data
  const items = {
    1: {id: '1', title: 'Foo', price: 42, quantity: 5},
    2: {id: '2', title: 'Bar', price: 17, quantity: 8},
  }

  dispatch(fetchProductListSuccess(items))
}
