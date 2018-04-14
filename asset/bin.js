const AssetServer = require('./')

const { start, log } = AssetServer()

process.on('unhandledRejection', (reason, p) =>
  log.fatal(reason)
)

start()
