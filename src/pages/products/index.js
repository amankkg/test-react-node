import React, {useState, useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Emoji} from '../../components'
import {AddToCart} from './add-to-cart'
import {fetchProductList} from '../../thunks'

export const Products = () => {
  const productMap = useSelector((state) => state.productList.entries)
  const dispatch = useDispatch()
  const products = useMemo(() => Object.values(productMap), [productMap])
  const [current, setCurrent] = useState(null)
  const [currentAmount, setCurrentAmount] = useState(1)

  useEffect(() => {
    dispatch(fetchProductList())
  }, [dispatch])

  const onAdd = (amount) => {
    // TODO: use backend API
    console.log(`add to cart product ${current} - ${amount} pcs`)

    setCurrent(null)
    setCurrentAmount(1)
  }

  return products ? (
    <ul>
      {products.map((p, i) => (
        <li key={p.id}>
          <div onClick={() => setCurrent(p.id)} tabIndex={i + 1}>
            <p>
              {p.id}) {p.title} ${p.price} qty: {p.quantity}
            </p>
            {current === p.id && (
              <AddToCart
                value={currentAmount}
                max={p.quantity}
                onChange={setCurrentAmount}
                onAdd={onAdd}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>
      products not found <Emoji label="woman shrugs" content="🤷‍♀️" />
    </p>
  )
}
