const {createProxyMiddleware} = require('http-proxy-middleware')

const options = {
  target: process.env.REACT_APP_API_URL,
  changeOrigin: true,
  pathRewrite: {'^/api': ''},
}

module.exports = (app) => {
  app.use('/api', createProxyMiddleware(options))
}
