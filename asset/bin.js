const AssetServer = require('./')

const assetServer = AssetServer()

process.on('SIGTERM', assetServer.stop)
process.on('SIGINT', assetServer.stop)
process.on('unhandledRejection', (reason, p) => assetServer.log.fatal(reason))

assetServer.start()
