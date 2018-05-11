const Worker = require('./')

const worker = Worker()

process.on('SIGTERM', worker.stop)
process.on('SIGINT', worker.stop)
process.on('unhandledRejection', (reason, p) => worker.log.fatal(reason))

worker.start()
