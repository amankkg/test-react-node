import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {cart as actions} from '../../actions'

export const Entry = ({id, value}) => {
  const [previousValue, setPreviousValue] = useState(0)
  const dispatch = useDispatch()

  const {title, quantity, price} = useSelector(
    (state) => state.products.entries[id],
  )

  const onChange = (event) => {
    const nextValue = parseInt(event.currentTarget.value) || 0

    if (nextValue === 0) setPreviousValue(value)

    dispatch(actions.entryUpdated(id, nextValue))
  }

  const onBlur = () => {
    if (value > 0) return

    if (window.confirm('Do you want to remove this entry from cart?')) {
      dispatch(actions.entryRemoved(id))
    } else {
      dispatch(actions.entryUpdated(id, previousValue))
    }
  }

  const onRemove = () => {
    if (window.confirm('Are you sure?')) dispatch(actions.entryRemoved(id))
  }

  const htmlId = `entry-${id}`
  const className = value > quantity ? 'error' : undefined

  return (
    <div className={className}>
      <p>{title}</p>
      <p>Price: ${price}</p>
      <label htmlFor={htmlId}>Quantity:</label>
      <input
        id={htmlId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type="number"
        min={0}
        max={quantity}
      />
      <p>Cost: ${price * value}</p>
      <button onClick={onRemove} type="button">
        Remove
      </button>
    </div>
  )
}
