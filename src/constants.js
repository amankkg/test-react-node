export const statuses = Object.freeze({
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  OK: 'OK',
})

export const routes = Object.freeze({
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  PRODUCTS: '/products',
  CART: '/cart',
  PROFILE: '/profile',
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '/notfound',
})

export const permissions = Object.freeze({
  admin: Object.freeze(Object.values(routes)),
  guest: Object.freeze([
    routes.HOME,
    routes.NOT_FOUND,
    routes.FORBIDDEN,
    routes.PRODUCTS,
    routes.SIGNIN,
    routes.SIGNUP,
  ]),
  customer: Object.freeze([
    routes.HOME,
    routes.NOT_FOUND,
    routes.FORBIDDEN,
    routes.CART,
    routes.PRODUCTS,
    routes.PROFILE,
  ]),
})
