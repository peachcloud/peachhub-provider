const WebServer = require('./server')

const { start, log } = WebServer()

process.on('unhandledRejection', (reason, p) =>
  log.fatal(reason)
)

start()


