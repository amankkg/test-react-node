import React from 'react'
import {Provider} from 'react-redux'
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom'

import './app.css'
import * as pages from './pages'
import {store} from './store'

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <header>
          <Link to="/">Home</Link>
          &nbsp;
          <Link to="/products">Products</Link>
          &nbsp;
          <Link to="/cart">Cart</Link>
          &nbsp;
          <Link to="/signin">Sign In</Link>
          &nbsp;
          <Link to="/signup">Sign Up</Link>
        </header>
        <br />
        <main>
          <Switch>
            <Route exact path="/" component={pages.Home} />
            <Route path="/signin" component={pages.SignIn} />
            <Route path="/signup" component={pages.SignUp} />
            <Route path="/products" component={pages.Products} />
            <Route path="/cart" component={pages.Cart} />
            <Route path="*" component={pages.NotFound} />
          </Switch>
        </main>
      </BrowserRouter>
    </Provider>
  )
}
