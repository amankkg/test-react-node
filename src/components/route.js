import React from 'react'
import {Route as PlainRoute, Redirect} from 'react-router-dom'

import {routes} from '../constants'
import {useSelector} from 'react-redux'

export const Route = ({auth, ...props}) => {
  const {role} = useSelector((state) => state.account)
  const mustSignIn = auth === true && role === 'guest'
  const roleNotListed = Array.isArray(auth) && !auth.includes(role)

  if (mustSignIn || roleNotListed) {
    props.children = <Redirect to={routes.SIGNIN} />

    delete props.component
  }

  return <PlainRoute {...props} />
}
