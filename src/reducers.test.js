import {cart} from './reducers'

const defaultState = cart(undefined, {type: undefined})

describe('reducers > cart', () => {
  it('should ADD_TO_CART', () => {
    const id = 'foo'
    const expectedQuantity = 13
    const action = {
      type: 'ADD_TO_CART',
      payload: {
        id,
        quantity: expectedQuantity,
      },
    }

    const actual = cart(defaultState, action)

    expect(actual.entries[id]).toBe(expectedQuantity)
    expect(actual.promoCode).toBe(defaultState.promoCode)
  })

  it('should not UPDATE_QUANTITY of non-existent entry', () => {
    const id = 'foo'
    const quantity = 42
    const action = {type: 'UPDATE_QUANTITY', payload: {id, quantity}}

    const actual = cart(defaultState, action)

    expect(Object.entries(actual.entries).length).toBe(0)
  })
})
