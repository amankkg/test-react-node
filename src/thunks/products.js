import * as actions from '../actions'
import {request} from '../services'

export const fetchProducts = () => async (dispatch) => {
  const {started, finished} = actions.products.fetch
  let payload = {}

  dispatch(started())

  try {
    payload.entries = await request.api('/products')
  } catch (error) {
    payload = error
  }

  dispatch(finished(payload))
}
