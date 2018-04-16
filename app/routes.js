const { createRouteBundle } = require('redux-bundler')

module.exports = createRouteBundle({
  '/': require('./components/landing'),
  '*': require('./components/not-found')
})
