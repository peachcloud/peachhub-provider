const ApiServer = require('./')

const apiServer = ApiServer()

process.on('SIGTERM', apiServer.stop)
process.on('SIGINT', apiServer.stop)
process.on('unhandledRejection', (reason, p) => apiServer.log.fatal(reason))

apiServer.start()
