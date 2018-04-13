const authentication = require('@feathersjs/authentication')
const jwt = require('@feathersjs/authentication-jwt')

module.exports = Authentication

function Authentication (server) {
  const config = server.get('authentication')

  server.configure(authentication(config))
  server.configure(jwt())

  server.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  })
}
