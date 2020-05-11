export const statuses = Object.freeze({
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  OK: 'OK',
})

export const routes = Object.freeze({
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  PRODUCTS: '/products',
  CART: '/cart',
  PROFILE: '/profile',
  FORBIDDEN: '/forbidden',
})

export const permissions = Object.freeze({
  admin: Object.freeze(Object.values(routes)),
  guest: Object.freeze([
    routes.HOME,
    routes.SIGN_IN,
    routes.SIGN_UP,
    routes.FORBIDDEN,
    routes.PRODUCTS,
    routes.CART,
  ]),
  customer: Object.freeze([
    routes.HOME,
    routes.FORBIDDEN,
    routes.CART,
    routes.PRODUCTS,
    routes.PROFILE,
  ]),
})
