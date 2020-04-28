import React from 'react'
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom'

import './app.css'
import {Home, Products, Cart, NotFound} from './pages'

export const App = () => {
  return (
    <BrowserRouter>
      <header>
        <Link to="/">Home</Link>
        &nbsp;
        <Link to="/products">Products</Link>
        &nbsp;
        <Link to="/cart">Cart</Link>
      </header>
      <br />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/cart" component={Cart} />
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
    </BrowserRouter>
  )
}
