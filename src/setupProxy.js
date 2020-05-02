const {createProxyMiddleware} = require('http-proxy-middleware')

const dataApiOptions = {
  target: process.env.REACT_APP_DATA_API_PROXY_TARGET,
  changeOrigin: true,
  pathRewrite: {[`^${process.env.REACT_APP_DATA_API_URL}`]: ''},
}

const authApiOptions = {
  target: process.env.REACT_APP_AUTH_API_PROXY_TARGET,
  changeOrigin: true,
  pathRewrite: {[`^${process.env.REACT_APP_AUTH_API_URL}`]: ''},
}

module.exports = (app) => {
  app.use(
    process.env.REACT_APP_DATA_API_URL,
    createProxyMiddleware(dataApiOptions),
  )

  app.use(
    process.env.REACT_APP_AUTH_API_URL,
    createProxyMiddleware(authApiOptions),
  )
}
