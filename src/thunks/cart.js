import {cart} from '../actions'
import {timeout} from './helpers'

export const purchase = () => async (dispatch, getState) => {
  dispatch(cart.purchase.started())

  await timeout(2000)

  const state = getState()

  dispatch(cart.purchase.finished(state.cart))
}
