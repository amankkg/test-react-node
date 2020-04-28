import React, {useState, useEffect} from 'react'

import {Emoji} from '../../components'
import {AddToCart} from './add-to-cart'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [current, setCurrent] = useState(null)
  const [currentAmount, setCurrentAmount] = useState(1)

  useEffect(() => {
    async function fetchData() {
      // const response = await fetch('/api/products')
      // const items = await response.json()

      // TODO: use real data
      const items = [
        {id: '1', title: 'Foo', price: 42, quantity: 5},
        {id: '2', title: 'Bar', price: 17, quantity: 8},
      ]

      setProducts(items)
    }

    fetchData()
  }, [])

  const onAdd = (amount) => {
    // TODO: use backend API
    console.log(`add to cart product ${current} - ${amount} pcs`)

    const nextProducts = products.map((p) =>
      p.id === current ? {...p, quantity: p.quantity - amount} : p,
    )

    setProducts(nextProducts)
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
