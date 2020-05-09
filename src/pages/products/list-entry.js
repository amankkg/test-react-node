import React, {useReducer, useEffect, useRef} from 'react'
import {useDispatch} from 'react-redux'

import * as actions from '../../actions'
import {AddToCart} from './add-to-cart'

export const ListEntry = ({id, title, price, stocks}) => {
  const rootNode = useRef()
  const dispatch = useDispatch()
  const [active, toggleActive] = useReducer((state) => !state, false)

  const onClickOutside = (event) => {
    if (!rootNode.current.contains(event.target)) toggleActive()
  }

  const onAdd = (amount) => {
    dispatch(actions.cart.entryAdded(id, amount))
    toggleActive()
  }

  useEffect(() => {
    if (!active) return

    document.addEventListener('mousedown', onClickOutside)

    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [active])

  return (
    <div ref={rootNode}>
      <strong>{title}</strong>
      <p>Price: ${price}</p>
      <p>{stocks > 0 ? 'In stock' : 'Out of stock'}</p>
      {active ? (
        <AddToCart max={stocks} onAdd={onAdd} />
      ) : (
        <button onClick={toggleActive} disabled={stocks === 0}>
          Buy
        </button>
      )}
    </div>
  )
}
