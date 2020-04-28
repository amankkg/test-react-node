import React from 'react'

export const Emoji = ({label, content}) => (
  <span role="img" aria-label={label}>
    {content}
  </span>
)
