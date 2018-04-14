const ApiServer = require('./')

const { start, log } = ApiServer()

process.on('unhandledRejection', (reason, p) =>
  log.fatal(reason)
)

start()
