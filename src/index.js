import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<h1>Hello World!</h1>, document.querySelector('#root'))

fetch('/api/users')
  .then((resp) => resp.json())
  .then((users) => console.log(users))
