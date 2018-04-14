const Resque = require('node-resque')
const Redis = require('ioredis')
const { get } = require('lodash')
const Logger = require('pino')

const config = require('../config')
const Jobs = require('../jobs')

module.exports = startWorker

async function startWorker () {
  const redisUrl = get(config, 'redis.url')
  const logger = config.logger
    ? config.logger.child({ name: 'worker' })
    : Logger({ name: 'worker' })
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
    logger.info('shutting down worker')
    process.exit()
  }
}

async function createScheduler ({ connection, logger }) {
  const scheduler = new Resque.Scheduler({ connection })
  await scheduler.connect()
  scheduler.start()

  scheduler.on('start', () => { logger.info('scheduler started') })
  scheduler.on('end', () => { logger.info('scheduler ended') })
  scheduler.on('poll', () => { logger.info('scheduler polling') })
  scheduler.on('master', (state) => { logger.info('scheduler became master') })
  scheduler.on('error', (error) => { logger.info(`scheduler error >> ${error}`) })
  scheduler.on('workingTimestamp', (timestamp) => {
    logger.info(`scheduler working timestamp ${timestamp}`)
  })
  scheduler.on('transferredJob', (timestamp, job) => {
   logger.info(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`)
  })

  return scheduler
}

async function createWorker ({ connection, logger }) {
  const queues = [
    'main' // TODO what queues?
  ]
  const jobs = Jobs(config)
  const worker = new Resque.Worker({ connection, queues }, jobs)
  await worker.connect()
  await worker.workerCleanup() // optional: cleanup any previous improperly shutdown workers on this host
  worker.start()

  worker.on('start', () => { logger.info('worker started') })
  worker.on('end', () => { logger.info('worker ended') })
  worker.on('cleaning_worker', (worker, pid) => { logger.info(`cleaning old worker ${worker}`) })
  worker.on('poll', (queue) => { logger.info(`worker polling ${queue}`) })
  worker.on('job', (queue, job) => { logger.info(`working job ${queue} ${JSON.stringify(job)}`) })
  worker.on('reEnqueue', (queue, job, plugin) => { logger.info(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`) })
  worker.on('success', (queue, job, result) => { logger.info(`job success ${queue} ${JSON.stringify(job)} >> ${result}`) })
  worker.on('failure', (queue, job, failure) => { logger.info(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`) })
  worker.on('error', (error, queue, job) => { logger.info(`error ${queue} ${JSON.stringify(job)}  >> ${error}`) })
  worker.on('pause', () => { logger.info('worker paused') })

  return worker
}
