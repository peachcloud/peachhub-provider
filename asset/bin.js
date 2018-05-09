const AssetServer = require('./')

const assetServer = AssetServer()

process.on('SIGTERM', assetServer.stop)
process.on('SIGINT', assetServer.stop)
process.on('unhandledRejection', (reason, p) => assetServer.fatal(reason))

assetServer.start()
