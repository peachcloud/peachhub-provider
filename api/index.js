const socketio = require('@feathersjs/socketio')

const Authentication = require('./authentication')
const Channels = require('./channels')
const hooks = require('./hooks')
const Services = require('../services')
const Server = require('../util/server')
const Sql = require('../sql')
const Worker = require('./worker')

const defaultTheme = require('../app/themes/default')

module.exports = ApiServer

function ApiServer () {
  return Server('api', (server, config) => {
    const sql = Sql(config)
    server.set('sql', sql)

    server.set('theme', defaultTheme)

    server.hooks(hooks)

    server.configure(socketio())

    server.configure(Authentication)
    server.configure(Services)
    server.configure(Channels)

    server.asyncConfigure(Worker)

  })
}
