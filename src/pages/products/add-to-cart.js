import React from 'react'

const alertMessage =
  'product amount must be greater than zero and less or equal than total quantity'

export const AddToCart = ({value, max, onChange, onAdd}) => {
  const wrongAmount = value < 1 || value > max

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!wrongAmount) onAdd(value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(parseInt(event.currentTarget.value))}
        min={1}
        max={max}
      />
      {wrongAmount && <p className="error">{alertMessage}</p>}
      <button>add</button>
    </form>
  )
}
