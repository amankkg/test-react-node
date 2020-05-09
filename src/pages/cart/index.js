import React, {useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'

import {Emoji} from '../../components'
import {fetchMe, fetchProducts, purchase} from '../../thunks'
import {statuses} from '../../constants'
import {Entry} from './entry'

export const Cart = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const state = useSelector((state) => ({
    entriesMap: state.cart.entries,
    promoCode: state.cart.promoCode,
    productsMap: state.products.entries,
    cartStatus: state.account.status,
    productsStatus: state.products.status,
  }))

  const entries = useMemo(() => Object.entries(state.entriesMap), [
    state.entriesMap,
  ])

  useEffect(() => {
    if (state.cartStatus === statuses.IDLE) dispatch(fetchMe(history))
    if (state.productsStatus === statuses.IDLE) dispatch(fetchProducts())
  }, [dispatch, history, state.cartStatus, state.productsStatus])

  const ready =
    state.cartStatus === statuses.OK && state.productsStatus === statuses.OK

  if (!ready)
    return (
      <div>
        <h1>Cart</h1>
        <p>loading...</p>
      </div>
    )

  const onSubmit = (event) => {
    event.preventDefault()
    dispatch(purchase())
    history.push('/')
  }

  const error = entries.some(
    ([id, quantity]) => state.productsMap[id].quantity < quantity,
  )
    ? 'there are validation issues'
    : undefined

  const total = entries.reduce(
    (sum, [id, quantity]) => sum + quantity * state.productsMap[id].price,
    0,
  )

  return (
    <div>
      <h1>Cart</h1>
      {entries.length > 0 ? (
        <form onSubmit={onSubmit}>
          <ul>
            {entries.map(([id, quantity]) => (
              <li key={id}>
                <Entry id={id} value={quantity} />
              </li>
            ))}
          </ul>
          <label htmlFor="promoCode">Promo code</label>
          <input id="promoCode" value={state.promoCode} disabled />
          <p>Total: ${total}</p>
          {error && <p className="error">{error}</p>}
          <button>Proceed</button>
        </form>
      ) : (
        <p>
          cart is empty <Emoji label="woman shrugs" content="🤷‍♀️" />
        </p>
      )}
    </div>
  )
}
