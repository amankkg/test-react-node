import React, {useMemo} from 'react'
import {Route, Switch, Redirect, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'

import {Header} from './components'
import {routes, permissions} from './constants'
import {useRestoreSession} from './hooks'
import * as pages from './pages'

const routeList = [
  [routes.HOME, pages.Home, true],
  [routes.SIGN_IN, pages.SignIn, true],
  [routes.SIGN_IN, pages.SignIn, false, 'authServer'],
  [routes.SIGN_UP, pages.SignUp],
  [routes.PRODUCTS, pages.Products],
  [routes.CART, pages.Cart],
  [routes.PROFILE, pages.Profile],
  [routes.FORBIDDEN, pages.Forbidden],
]

export const App = () => {
  const role = useSelector((state) => state.account.role)
  const location = useLocation()
  const restored = useRestoreSession()

  const openRoutes = useMemo(
    () => routeList.filter(([route]) => permissions[role].includes(route)),
    [role],
  )

  if (!restored) return <p>restoring session...</p>

  const allowed = openRoutes.some(([path, _, exact = false]) =>
    exact ? location.pathname === path : location.pathname.startsWith(path),
  )

  if (!allowed) return <Redirect to={routes.FORBIDDEN} />

  return (
    <>
      <Header />
      <br />
      <main>
        <Switch>
          {openRoutes.map(
            ([path, component, exact = false, ...routeParams]) => {
              for (const param of routeParams) path += '/:' + param

              return (
                <Route
                  key={path}
                  path={path}
                  exact={exact}
                  component={component}
                />
              )
            },
          )}
          <Route path="*" component={pages.NotFound} />
        </Switch>
      </main>
    </>
  )
}
