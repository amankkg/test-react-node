import React, {useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Emoji} from '../../components'
import {fetchProducts} from '../../thunks'
import {statuses} from '../../constants'

import {ListEntry} from './list-entry'

export const Products = () => {
  const state = useSelector((state) => state.products)
  const dispatch = useDispatch()
  const products = useMemo(() => Object.values(state.entries), [state.entries])

  useEffect(() => {
    if (state.status === statuses.IDLE) dispatch(fetchProducts())
  }, [dispatch, state.status])

  if (state.status === statuses.PENDING)
    return (
      <div>
        <h1>Products</h1>
        <p>loading...</p>
      </div>
    )

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((p, i) => (
          <li key={p.id}>
            <ListEntry
              id={p.id}
              title={p.title}
              price={p.price}
              stocks={p.quantity}
            />
          </li>
        ))}
      </ul>
      {products.length === 0 && (
        <p>
          products not found <Emoji label="woman shrugs" content="🤷‍♀️" />
        </p>
      )}
      {state.status === statuses.ERROR && (
        <p className="error">{state.error}</p>
      )}
    </div>
  )
}
