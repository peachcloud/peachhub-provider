const compress = require('compression')
const configuration = require('@feathersjs/configuration')
const cors = require('cors')
const express = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers')
const helmet = require('helmet')
const Logger = require('express-pino-logger')
const serverSummary = require('server-summary')
const { join } = require('path')
const { merge } = require('ramda')

const asyncConfigure = require('./asyncConfigure')

const config = require('../config')

module.exports = Server

function Server (name, cb) {
  const server = express(feathers())
  server.configure(require('../util/asyncConfigure'))

  const logger = config.logger
    ? Logger({ logger: config.logger.child({ name }) })
    : Logger({ name })
  server.use(logger)
  const log = logger.logger
  server.set('logger', log) 

  server.config = config
  server.configure(configuration())

  server.use(cors())
  server.use(helmet())
  server.use(compress())

  cb(server, config)

  // fancy error page
  server.use(express.errorHandler())

  return {
    start,
    stop,
    log
  }

  async function start (cb) {
    const { port, url } = config[name]

    await server.ready

    var httpServer = server.listen(port, () => {
      if (httpServer == null) return
      serverSummary(httpServer, info => {
        log.info(info, `${name} server listening`)
      })()
    })
  }

  async function stop (cb) {
    server.close(cb)
  }
}
