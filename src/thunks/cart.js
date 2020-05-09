import * as actions from '../actions'
import {request} from '../services'

export const purchase = () => async (dispatch, getState) => {
  const {started, finished} = actions.cart.purchase
  const {
    cart: {entries, promoCode},
    account: {token},
  } = getState()
  let payload = {entries}

  dispatch(started())

  try {
    const options = {method: 'post', body: {entries, promoCode}, token}

    await request.api('/purchase', options)
  } catch (error) {
    payload = error
  }

  dispatch(finished(payload))
}
