const {createProxyMiddleware} = require('http-proxy-middleware')

const options = {
  target: `http://localhost:${process.env.REACT_APP_API_PORT}`,
  changeOrigin: true,
  pathRewrite: {'^/api': ''},
}

module.exports = (app) => {
  app.use('/api', createProxyMiddleware(options))
}
