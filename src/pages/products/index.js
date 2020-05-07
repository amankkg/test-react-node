import React, {useState, useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {cart as cartActions} from '../../actions'
import {Emoji} from '../../components'
import {fetchProductList} from '../../thunks'
import {statuses} from '../../constants'

import {AddToCart} from './add-to-cart'

export const Products = () => {
  const state = useSelector((state) => state.products)
  const dispatch = useDispatch()
  const products = useMemo(() => Object.values(state.entries), [state.entries])
  const [currentId, setCurrent] = useState(null)

  useEffect(() => {
    if (state.status === statuses.IDLE) dispatch(fetchProductList())
  }, [dispatch, state.status])

  if (state.status === statuses.PENDING)
    return (
      <div>
        <h1>Products</h1>
        <p>loading...</p>
      </div>
    )

  const onAdd = (amount) => {
    dispatch(cartActions.entryAdded(currentId, amount))
    setCurrent(null)
  }

  return (
    <div>
      <h1>Products</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((p, i) => (
            <li key={p.id}>
              <p>
                {p.title} ${p.price} qty: {p.quantity}
              </p>
              {currentId === p.id ? (
                <AddToCart max={p.quantity} onAdd={onAdd} />
              ) : (
                <button onClick={() => setCurrent(p.id)}>Buy</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          products not found <Emoji label="woman shrugs" content="🤷‍♀️" />
        </p>
      )}
    </div>
  )
}
