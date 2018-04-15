const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio-client')
const authentication = require('@feathersjs/authentication-client')
const io = require('socket.io-client')

function createClient (config) {
  const socket = io(config.api.url)

  const client = feathers()
    .configure(socketio(socket))
    .configure(authentication({
      storage: window.localStorage
    }))

  return client
}

module.exports = createClient
