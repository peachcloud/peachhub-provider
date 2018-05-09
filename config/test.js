const findPort = require('find-port-sync')
const isCi = process.env.CI

const apiPort = findPort()
const assetPort = findPort()

module.exports = {
  authentication: {
    secret: 'secret'
  },
  api: {
    port: apiPort,
    url: `http://localhost:${apiPort}`
  },
  asset: {
    port: assetPort,
    url: `http://localhost:${assetPort}`
  },
  mailer: {
    port: findPort(),
    web: findPort(),
    ignoreTLS: true
  },
  log: {
    level: 'fatal'
  },
  sql: {
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: isCi ? null : 'password',
      database: 'butthub_provider_test'
    }
  },
  worker: {
    queue: 'test'
  }
}
