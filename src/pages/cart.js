import React, {useState, useEffect} from 'react'

import {Emoji} from '../components'

// TODO: add total cost
// TODO: add feature to update entry quantity
export const Cart = () => {
  const [entries, setEntries] = useState(null)
  const [productsMap, setProductsMap] = useState(null)

  useEffect(() => {
    async function fetchCart() {
      // const response = await fetch('/api/cart')
      // const entries = await response.json()

      const entries = [
        {id: '1', quantity: 2},
        {id: '2', quantity: 3},
      ]

      setEntries(entries)
    }

    async function fetchProducts() {
      // const response = await fetch('/api/products')
      // const products = await response.json()
      // const productsMap = new Map(...products)

      const productsMap = new Map([
        ['1', {id: '1', title: 'Foo', price: 42, quantity: 17}],
        ['2', {id: '2', title: 'Bar', price: 17, quantity: 42}],
      ])

      setProductsMap(productsMap)
    }

    fetchCart()
    fetchProducts()
  }, [])

  return entries && productsMap ? (
    <ul>
      {entries.map(({id, quantity}, i) => {
        const product = productsMap.get(id)
        const cost = product.price * quantity

        return (
          <li key={id}>
            {i + 1}) {product.title} ${product.price} * {quantity} pcs = ${cost}
          </li>
        )
      })}
    </ul>
  ) : (
    <p>
      cart is empty <Emoji label="woman shrugs" content="🤷‍♀️" />
    </p>
  )
}
