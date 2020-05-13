import React, {useState} from 'react'

export const AddToCart = ({max, onAdd}) => {
  const [value, setValue] = useState(1)
  const wrongAmount = value < 1 || value > max
  const alertMessage = `product amount must be greater than zero and less or equal than ${max}`

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!wrongAmount) onAdd(value)
  }

  const onChange = (event) => setValue(parseInt(event.currentTarget.value) || 0)

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        defaultValue={1}
        onChange={onChange}
        min={1}
        max={max}
      />
      {wrongAmount && <p className="error">{alertMessage}</p>}
      <button>Add To Cart</button>
    </form>
  )
}
