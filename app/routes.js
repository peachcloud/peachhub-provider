const { createRouteBundle } = require('redux-bundler')

module.exports = createRouteBundle({
  '/': require('./pages/landing')
})
