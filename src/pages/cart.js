import React, {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import * as actions from '../actions'
import {Emoji} from '../components'
import {fetchCart, fetchProductList} from '../thunks'
import {useHistory} from 'react-router-dom'

// TODO: add total cost
// TODO: add feature to update entry quantity
export const Cart = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const state = useSelector((state) => ({
    entriesMap: state.cart.entries,
    promoCode: state.cart.promoCode,
    productsMap: state.productList.entries,
    cartFetchStatus: state.cart.status,
    productsFetchStatus: state.productList.status,
  }))
  const [lastQuantityValue, rememberLastQuantityValue] = useState(0)

  const entries = useMemo(() => Object.entries(state.entriesMap), [
    state.entriesMap,
  ])

  useEffect(() => {
    if (state.cartFetchStatus === 0) dispatch(fetchCart())
    if (state.productsFetchStatus === 0) dispatch(fetchProductList())
  }, [dispatch, state.cartFetchStatus, state.productsFetchStatus])

  const ready = state.cartFetchStatus === 2 && state.productsFetchStatus === 2

  if (!ready)
    return (
      <div>
        <h1>Cart</h1>
        <p>loading...</p>
      </div>
    )

  const proceedToCheckout = () => {
    dispatch(actions.processCart(state.entriesMap))

    history.push('/')
  }

  const error = entries.some(
    ([id, quantity]) => state.productsMap[id].quantity < quantity,
  )
    ? 'there are validation issues'
    : undefined

  const onRemoveEntry = (id) => {
    if (window.confirm('Are you sure?')) dispatch(actions.deleteEntry(id))
  }

  const onBlurRemoveEntry = (id) => {
    if (window.confirm('Do you want to remove this entry from cart?')) {
      dispatch(actions.deleteEntry(id))
    } else {
      dispatch(actions.updateQuantity(id, lastQuantityValue))
    }
  }

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

                dispatch(actions.updateQuantity(id, value))
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
          {error && <p className="error">{error}</p>}
          <button>Proceed</button>
        </form>
      ) : (
        <p>
          cart is empty <Emoji label="woman shrugs" content="🤷‍♀️" />
        </p>
      )}
      <label htmlFor="promoCode">Promo code</label>
      <input id="promoCode" value={state.promoCode} disabled />
    </div>
  )
}
