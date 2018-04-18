const Resque = require('node-resque')
const Redis = require('ioredis')
const { path } = require('ramda')
const Logger = require('pino')

const config = require('../config')
const Jobs = require('../jobs')

module.exports = startWorker

const getRedisUrl = path(['redis', 'url'])

async function startWorker () {
  const redisUrl = getRedisUrl(config)
  const logger = config.logger
    ? config.logger.child({ name: 'worker' })
    : Logger({ name: 'worker', /* level: 'debug' */ })
  const connection = {
    redis: new Redis(redisUrl)
  }
  const worker = await createWorker({ connection, logger })
  const scheduler = await createScheduler({ connection, logger })

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  async function shutdown () {
    await scheduler.end()
    await worker.end()
    process.exit()
  }
}

async function createScheduler ({ connection, logger }) {
  const scheduler = new Resque.Scheduler({ connection })
  scheduler.on('start', () => { logger.info('scheduler started') })
  scheduler.on('end', () => { logger.info('scheduler ended') })
  scheduler.on('poll', () => { logger.debug('scheduler polling') })
  scheduler.on('master', (state) => { logger.debug('scheduler became master') })
  scheduler.on('error', (error) => { logger.debug(`scheduler error >> ${error}`) })
  scheduler.on('workingTimestamp', (timestamp) => {
    logger.debug(`scheduler working timestamp ${timestamp}`)
  })
  scheduler.on('transferredJob', (timestamp, job) => {
    logger.debug(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`)
  })

  await scheduler.connect()
  scheduler.start()

  return scheduler
}

async function createWorker ({ connection, logger }) {
  const queues = [
    'mailer'
  ]
  const jobs = Jobs(config)
  const worker = new Resque.Worker({ connection, queues }, jobs)

  worker.on('start', () => { logger.info('worker started') })
  worker.on('end', () => { logger.info('worker ended') })
  worker.on('cleaning_worker', (worker, pid) => { logger.debug(`cleaning old worker ${worker}`) })
  worker.on('poll', (queue) => { logger.debug(`worker polling ${queue}`) })
  worker.on('job', (queue, job) => { logger.debug(`working job ${queue} ${JSON.stringify(job)}`) })
  worker.on('reEnqueue', (queue, job, plugin) => { logger.debug(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`) })
  worker.on('success', (queue, job, result) => { logger.debug(`job success ${queue} ${JSON.stringify(job)} >> ${result}`) })
  worker.on('failure', (queue, job, failure) => { logger.debug(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`) })
  worker.on('error', (error, queue, job) => { logger.debug(`error ${queue} ${JSON.stringify(job)}  >> ${error}`) })
  worker.on('pause', () => { logger.debug('worker paused') })

  await worker.connect()
  await worker.workerCleanup() // optional: cleanup any previous improperly shutdown workers on this host
  worker.start()

  return worker
}
