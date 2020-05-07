import React, {useEffect} from 'react'
import {Switch, Route, Link, useHistory, useLocation} from 'react-router-dom'
import {useDispatch} from 'react-redux'

import './app.css'
import * as actions from './actions'
import {storage} from './services'
import * as pages from './pages'
import {fetchMe} from './thunks'

export const App = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    async function rehydrateState() {
      const tokens = await storage.read(
        process.env.REACT_APP_IDENTITY_STORAGE_KEY,
      )

      if (tokens && Date.parse(tokens.tokenExpire) > Date.now()) {
        dispatch(actions.account.signIn.finished(tokens))
        dispatch(fetchMe(history))

        if (location.pathname.startsWith('/signin')) history.push('/')
      }
    }

    rehydrateState()
  }, [])

  return (
    <>
      <header>
        <Link to="/">Home</Link>
        &nbsp;
        <Link to="/products">Products</Link>
        &nbsp;
        <Link to="/cart">Cart</Link>
        &nbsp;
        <Link to="/profile">Profile</Link>
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
          <Route path="/profile" component={pages.Profile} />
          <Route path="*" component={pages.NotFound} />
        </Switch>
      </main>
    </>
  )
}
