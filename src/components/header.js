import React, {useMemo} from 'react'
import {NavLink, Link, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'

import {routes, permissions} from '../constants'

const links = [
  [routes.PRODUCTS, 'Products'],
  [routes.CART, 'Cart'],
  [routes.PROFILE, 'Profile'],
  [routes.SIGN_IN, 'Sign In'],
  [routes.SIGN_UP, 'Sign Up'],
]

export const Header = () => {
  const {role} = useSelector((state) => state.account)
  const location = useLocation()

  const navLinks = useMemo(
    () =>
      links.map(
        ([to, text]) =>
          permissions[role].includes(to) && (
            <NavLink key={to} activeClassName="active-link" to={to}>
              {text}
            </NavLink>
          ),
      ),
    [role],
  )

  const homeActiveClass =
    location.pathname === routes.HOME ? 'active-link' : undefined

  return (
    <header>
      <Link className={homeActiveClass} to={routes.HOME}>
        Home
      </Link>
      {navLinks}
    </header>
  )
}
