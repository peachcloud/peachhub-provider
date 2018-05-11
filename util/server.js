const compress = require('compression')
const configuration = require('@feathersjs/configuration')
const cors = require('cors')
const express = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers')
const helmet = require('helmet')
const Logger = require('express-pino-logger')
const serverSummary = require('server-summary')

const config = require('../config')

module.exports = Server

function Server (name, handlers) {
  const { onCreate = noop, onStart = noop, onStop = noop } = handlers

  const server = express(feathers())
  server.configure(require('../util/asyncConfigure'))

  const logger = config.logger
    ? Logger({ logger: config.logger.child({ name }) })
    : Logger({ name, level: config.log.level })
  server.use(logger)
  const log = logger.logger
  server.set('logger', log)

  server.config = config
  server.configure(configuration())

  server.use(cors())
  server.use(helmet())
  server.use(compress())

  onCreate(server, config)

  // fancy error page
  server.use(express.errorHandler())

  var httpServer

  return {
    server,
    start,
    stop,
    log
  }

  async function start () {
    const { port } = config[name]

    await server.ready

    await Promise.resolve(onStart(server, config))

    return new Promise((resolve, reject) => {
      httpServer = server.listen(port)
      httpServer.once('error', reject)
      httpServer.once(
        'listening',
        serverSummary(httpServer, info => {
          httpServer.removeListener('error', reject)
          log.info(info, `${name} server listening`)
          resolve()
        })
      )
    })
  }

  async function stop () {
    await Promise.resolve(onStop(server, config))

    return new Promise((resolve, reject) => {
      if (httpServer == null) return resolve()
      log.info(`${name} server closing`)
      httpServer.once('error', reject)
      httpServer.once('close', () => {
        log.info(`${name} server closed`)
        httpServer.removeListener('error', reject)
        httpServer = null
        resolve()
      })
      httpServer.close()
    })
  }
}

function noop () {}
