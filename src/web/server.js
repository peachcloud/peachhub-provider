const compress = require('compression')
const configuration = require('@feathersjs/configuration')
const cors = require('cors')
const express = require('@feathersjs/express')
const favicon = require('serve-favicon')
const feathers = require('@feathersjs/feathers')
const helmet = require('helmet')
const Logger = require('express-pino-logger')
const serverSummary = require('server-summary')
const socketio = require('@feathersjs/socketio')
const { join } = require('path')
const { get, assign } = require('lodash')

const asyncConfigure = require('../util/asyncConfigure')

const Authentication = require('./authentication')
const Channels = require('./channels')
const config = require('../config')
const Services = require('../services')
const WorkerQueue = require('./services/workerQueue')
const Browser = require('./services/browser')

module.exports = WebServer

function WebServer (cb) {
  const server = express(feathers())
  server.configure(require('../util/asyncConfigure'))

  const logger = config.logger
    ? Logger({ logger: config.logger })
    : Logger()
  server.use(logger)
  const log = logger.logger

  server.config = config
  server.configure(configuration())

  server.use(cors())
  server.use(helmet())
  server.use(compress())
  server.use(favicon(join(get(config, 'assets.path'), 'favicon.ico')))

  if (server.get('assets.url') == '/') {
    server.use('/', express.static(get(config, 'assets.path')))
  }

  server.configure(socketio())

  //server.configure(Authentication)
  server.configure(Services)
  server.configure(Channels)
  server.asyncConfigure(WorkerQueue)
  server.asyncConfigure(Browser)

  // fancy error page
  server.use(express.errorHandler())

  return {
    start,
    stop,
    log
  }

  async function start (cb) {
    const { port, url } = config.web

    await server.ready

    var httpServer = server.listen(port, () => {
      serverSummary(httpServer, info => {
        const summary = assign(info, {
          message: 'server listening'
        })
        log.info(summary)
      })()
    })
  }

  async function stop (cb) {
    server.close(cb)
  }
}
