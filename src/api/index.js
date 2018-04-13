const socketio = require('@feathersjs/socketio')

const Server = require('../util/server')

const Authentication = require('./authentication')
const Channels = require('./channels')
const Services = require('../services')
const Worker = require('./worker')

module.exports = ApiServer

function ApiServer () {
  return Server('api', (server) => {
    server.configure(socketio())

    server.configure(Authentication)
    server.configure(Services)
    server.configure(Channels)

    server.asyncConfigure(Worker)
  })
}
