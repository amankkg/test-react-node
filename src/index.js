import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<h1>Hello World!</h1>, document.querySelector('#root'))

fetch('http://localhost:3001/').then((resp) => console.log(resp))
