import React, {useMemo} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'

import {Header} from './components'
import {routes, permissions} from './constants'
import {useRestoreSession, useRouteCheck} from './hooks'
import * as pages from './pages'

const defaultRoutes = {
  admin: routes.FORBIDDEN,
  guest: routes.SIGNIN,
  customer: routes.FORBIDDEN,
}

const getAppRoutes = (role) =>
  [
    [routes.SIGNIN, pages.SignIn],
    [routes.SIGNUP, pages.SignUp],
    [routes.PRODUCTS, pages.Products],
    [routes.CART, pages.Cart],
    [routes.PROFILE, pages.Profile],
    [routes.FORBIDDEN, pages.Forbidden],
  ].filter(([route]) => permissions[role].includes(route))

export const App = () => {
  const role = useSelector((state) => state.account.role)
  const openRoutes = useMemo(() => getAppRoutes(role), [role])
  const restored = useRestoreSession()
  const routeAllowed = useRouteCheck(openRoutes)

  if (!restored) return <p>restoring session...</p>
  if (!routeAllowed) return <Redirect to={defaultRoutes[role]} />

  return (
    <>
      <Header />
      <br />
      <main>
        <Switch>
          <Route exact path={routes.HOME} component={pages.Home} />
          {openRoutes.map(([path, component]) => (
            <Route key={path} path={path} component={component} />
          ))}
          <Route path="*" component={pages.NotFound} />
        </Switch>
      </main>
    </>
  )
}
