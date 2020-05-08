import React, {useEffect, useMemo} from 'react'
import {Switch, Route, Link, useHistory, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import './app.css'
import * as actions from './actions'
import {storage} from './services'
import * as pages from './pages'
import {fetchMe} from './thunks'
import {routes} from './constants'

const permissions = {
  admin: Object.values(routes),
  guest: [routes.PRODUCTS, routes.SIGNIN, routes.SIGNUP, routes.FORBIDDEN],
  customer: [routes.CART, routes.PRODUCTS, routes.PROFILE, routes.FORBIDDEN],
}

const defaultRoutes = {
  admin: routes.FORBIDDEN,
  guest: routes.SIGNIN,
  customer: routes.FORBIDDEN,
}

const getNavLinks = (role) =>
  [
    [routes.HOME, 'Home'],
    [routes.PRODUCTS, 'Products'],
    [routes.CART, 'Cart'],
    [routes.PROFILE, 'Profile'],
    [routes.SIGNIN, 'Sign In'],
    [routes.SIGNUP, 'Sign Up'],
  ].filter(([route, text]) => permissions[role].includes(route))

const getAppRoutes = (role) =>
  [
    [routes.SIGNIN, pages.SignIn],
    [routes.SIGNUP, pages.SignUp],
    [routes.PRODUCTS, pages.Products],
    [routes.CART, pages.Cart],
    [routes.PROFILE, pages.Profile],
  ].filter(([route, component]) => permissions[role].includes(route))

export const App = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const role = useSelector((state) => state.account.role)
  const navLinks = useMemo(() => getNavLinks(role), [role])
  const appRoutes = useMemo(() => getAppRoutes(role), [role])

  useEffect(() => {
    async function rehydrateState() {
      const tokens = await storage.read(
        process.env.REACT_APP_IDENTITY_STORAGE_KEY,
      )

      if (tokens && Date.parse(tokens.tokenExpire) > Date.now()) {
        dispatch(actions.account.signIn.finished(tokens))
        dispatch(fetchMe(history))

        if (location.pathname.startsWith(routes.SIGNIN)) history.push('/')
      }
    }

    rehydrateState()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (
    location.pathname !== routes.HOME &&
    appRoutes.every((x) => location.pathname !== x[0])
  )
    history.push(defaultRoutes[role])

  return (
    <>
      <header>
        {navLinks.map(([to, text]) => (
          <Link key={to} to={to}>
            {text}
          </Link>
        ))}
      </header>
      <br />
      <main>
        <Switch>
          <Route exact path={routes.HOME} component={pages.Home} />
          {appRoutes.map(([path, component]) => (
            <Route key={path} path={path} component={component} />
          ))}
          <Route path={routes.FORBIDDEN} component={pages.Forbidden} />
          <Route path="*" component={pages.NotFound} />
        </Switch>
      </main>
    </>
  )
}
