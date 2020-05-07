import React, {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'

import * as actions from '../actions'
import {Emoji} from '../components'
import {fetchMe, fetchProductList, purchase} from '../thunks'
import {statuses} from '../constants'

export const Cart = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const state = useSelector((state) => ({
    entriesMap: state.cart.entries,
    promoCode: state.cart.promoCode,
    productsMap: state.products.entries,
    cartFetchStatus: state.account.status,
    productsFetchStatus: state.products.status,
  }))
  const [lastQuantityValue, rememberLastQuantityValue] = useState(0)

  const entries = useMemo(() => Object.entries(state.entriesMap), [
    state.entriesMap,
  ])

  useEffect(() => {
    if (state.cartFetchStatus === statuses.IDLE) dispatch(fetchMe(history))
    if (state.productsFetchStatus === statuses.IDLE)
      dispatch(fetchProductList())
  }, [dispatch, history, state.cartFetchStatus, state.productsFetchStatus])

  const ready =
    state.cartFetchStatus === statuses.OK &&
    state.productsFetchStatus === statuses.OK

  if (!ready)
    return (
      <div>
        <h1>Cart</h1>
        <p>loading...</p>
      </div>
    )

  const proceedToCheckout = () => {
    dispatch(purchase())

    history.push('/')
  }

  const error = entries.some(
    ([id, quantity]) => state.productsMap[id].quantity < quantity,
  )
    ? 'there are validation issues'
    : undefined

  const onRemoveEntry = (id) => {
    if (window.confirm('Are you sure?')) dispatch(actions.cart.entryRemoved(id))
  }

  const onBlurRemoveEntry = (id) => {
    if (window.confirm('Do you want to remove this entry from cart?')) {
      dispatch(actions.cart.entryRemoved(id))
    } else {
      dispatch(actions.cart.entryUpdated(id, lastQuantityValue))
    }
  }

  const total = entries.reduce(
    (sum, [id, quantity]) => sum + quantity * state.productsMap[id].price,
    0,
  )

  return (
    <div>
      <h1>Cart</h1>
      {entries.length > 0 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            proceedToCheckout()
          }}
        >
          <ul>
            {entries.map(([id, quantity], i) => {
              const product = state.productsMap[id]
              const cost = product.price * quantity
              const htmlId = `cart-entry-${i}`
              const className =
                product.quantity < quantity ? 'error' : undefined
              const onBlur =
                quantity === 0 ? () => onBlurRemoveEntry(id) : undefined
              const onChange = (id, value) => {
                if (value === 0) rememberLastQuantityValue(quantity)

                dispatch(actions.cart.entryUpdated(id, value))
              }

              return (
                <li key={id}>
                  <div className={className}>
                    <p>{product.title}</p>
                    <p>Price: ${product.price}</p>
                    <label htmlFor={htmlId}>Quantity (pcs):</label>
                    <input
                      id={htmlId}
                      value={quantity}
                      onChange={(e) =>
                        onChange(id, parseInt(e.currentTarget.value) || 0)
                      }
                      onBlur={onBlur}
                      type="number"
                      min={0}
                      max={product.quantity}
                    />
                    <p>Cost: ${cost}</p>
                    <button onClick={() => onRemoveEntry(id)} type="button">
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
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
