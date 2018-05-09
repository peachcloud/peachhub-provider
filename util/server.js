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

function Server (name, cb) {
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

  cb(server, config)

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

    return new Promise((resolve, reject) => {
      httpServer = server.listen(port, err => {
        if (httpServer == null) return
        if (err) return reject(err)
        serverSummary(httpServer, info => {
          log.info(info, `${name} server listening`)
          resolve()
        })()
      })
    })
  }

  async function stop () {
    return new Promise((resolve, reject) => {
      console.log('closing server', name)
      httpServer.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}
