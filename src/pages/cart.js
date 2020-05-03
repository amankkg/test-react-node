import React, {useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Emoji} from '../components'
import {fetchCart} from '../thunks'

// TODO: add total cost
// TODO: add feature to update entry quantity
export const Cart = () => {
  const dispatch = useDispatch()
  const {productsMap, entriesMap, promoCode} = useSelector((state) => ({
    entriesMap: state.cart.entries,
    promoCode: state.cart.promoCode,
    productsMap: state.productList.entries,
  }))

  const entries = useMemo(() => Object.entries(entriesMap), [entriesMap])

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const loaded =
    entries && productsMap && Object.entries(productsMap).length > 0

  return loaded ? (
    <div>
      <ul>
        {entries.map(([id, quantity], i) => {
          const product = productsMap[id]
          const cost = product.price * quantity

          return (
            <li key={id}>
              {i + 1}) {product.title} ${product.price} * {quantity} pcs = $
              {cost}
            </li>
          )
        })}
      </ul>
      <label htmlFor="promoCode">Promo code</label>
      <input id="promoCode" value={promoCode} readOnly />
    </div>
  ) : (
    <p>
      cart is empty <Emoji label="woman shrugs" content="🤷‍♀️" />
    </p>
  )
}
