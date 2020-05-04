import React, {useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Emoji} from '../components'
import {fetchCart, fetchProductList} from '../thunks'

// TODO: add total cost
// TODO: add feature to update entry quantity
export const Cart = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => ({
    entriesMap: state.cart.entries,
    promoCode: state.cart.promoCode,
    productsMap: state.productList.entries,
    cartFetchStatus: state.cart.status,
    productsFetchStatus: state.productList.status,
  }))

  const entries = useMemo(() => Object.entries(state.entriesMap), [
    state.entriesMap,
  ])

  useEffect(() => {
    if (state.cartFetchStatus === 0) dispatch(fetchCart())
    if (state.productsFetchStatus === 0) dispatch(fetchProductList())
  }, [dispatch, state.cartFetchStatus, state.productsFetchStatus])

  const ready = state.cartFetchStatus === 2 && state.productsFetchStatus === 2

  return ready ? (
    <div>
      <h1>Cart</h1>
      <ul>
        {entries.map(([id, quantity], i) => {
          const product = state.productsMap[id]
          const cost = product.price * quantity

          return (
            <li key={id}>
              {product.title} ${product.price} * {quantity} pcs = ${cost}
            </li>
          )
        })}
      </ul>
      <label htmlFor="promoCode">Promo code</label>
      <input id="promoCode" value={state.promoCode} disabled />
    </div>
  ) : (
    <p>
      cart is empty <Emoji label="woman shrugs" content="🤷‍♀️" />
    </p>
  )
}
