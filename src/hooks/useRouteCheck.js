import {useLocation} from 'react-router-dom'

import {routes} from '../constants'

export function useRouteCheck(allowedRoutes) {
  const location = useLocation()

  if (location.pathname === routes.HOME) return true

  return allowedRoutes.some((x) => location.pathname === x[0])
}
