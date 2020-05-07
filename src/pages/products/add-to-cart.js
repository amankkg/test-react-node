import React, {useState} from 'react'

const alertMessage =
  'product amount must be greater than zero and less or equal than total quantity'

export const AddToCart = ({max, onAdd}) => {
  const [value, setValue] = useState(1)
  const wrongAmount = value < 1 || value > max

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!wrongAmount) onAdd(value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        defaultValue={value}
        onChange={(event) => setValue(parseInt(event.currentTarget.value))}
        min={1}
        max={max}
      />
      {wrongAmount && <p className="error">{alertMessage}</p>}
      <button>Add To Cart</button>
    </form>
  )
}
