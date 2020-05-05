const {createProxyMiddleware} = require('http-proxy-middleware')

const mainApiOptions = {
  target: process.env.REACT_APP_MAIN_API_PROXY_TARGET,
  changeOrigin: true,
  pathRewrite: {[`^${process.env.REACT_APP_MAIN_API_URL}`]: ''},
}

const authApiOptions = {
  target: process.env.REACT_APP_AUTH_API_PROXY_TARGET,
  changeOrigin: true,
  pathRewrite: {[`^${process.env.REACT_APP_AUTH_API_URL}`]: ''},
}

module.exports = (app) => {
  app.use(
    process.env.REACT_APP_MAIN_API_URL,
    createProxyMiddleware(mainApiOptions),
  )

  app.use(
    process.env.REACT_APP_AUTH_API_URL,
    createProxyMiddleware(authApiOptions),
  )
}
