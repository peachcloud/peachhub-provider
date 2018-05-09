const Resque = require('node-resque')
const Redis = require('ioredis')
const { path } = require('ramda')
const Log = require('pino')

const config = require('../config')
const Jobs = require('../jobs')

module.exports = Worker

const getRedisUrl = path(['redis', 'url'])

function Worker () {
  const redisUrl = getRedisUrl(config)
  const log = config.logger
    ? config.log.child({ name: 'worker' })
    : Log({ name: 'worker', level: config.log.level })
  const queue = config.worker.queue

  var connection, worker, scheduler

  return {
    start,
    stop,
    log
  }

  async function start () {
    connection = {
      redis: new Redis(redisUrl)
    }
    worker = await createWorker({ connection, log, queue })
    scheduler = await createScheduler({ connection, log })
  }

  async function stop () {
    await scheduler.end()
    await worker.end()
  }
}

async function createScheduler ({ connection, log }) {
  const scheduler = new Resque.Scheduler({ connection })
  scheduler.on('start', () => {
    log.info('scheduler started')
  })
  scheduler.on('end', () => {
    log.info('scheduler ended')
  })
  scheduler.on('poll', () => {
    log.debug('scheduler polling')
  })
  scheduler.on('master', state => {
    log.debug('scheduler became master')
  })
  scheduler.on('error', error => {
    log.debug(`scheduler error >> ${error}`)
  })
  scheduler.on('workingTimestamp', timestamp => {
    log.debug(`scheduler working timestamp ${timestamp}`)
  })
  scheduler.on('transferredJob', (timestamp, job) => {
    log.debug(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`)
  })

  await scheduler.connect()
  scheduler.start()

  return scheduler
}

async function createWorker ({ connection, log, queue }) {
  const queues = [queue]
  const jobs = Jobs(config)
  const worker = new Resque.Worker({ connection, queues }, jobs)

  worker.on('start', () => {
    log.info('worker started')
  })
  worker.on('end', () => {
    log.info('worker ended')
  })
  worker.on('cleaning_worker', (worker, pid) => {
    log.debug(`cleaning old worker ${worker}`)
  })
  worker.on('poll', queue => {
    log.debug(`worker polling ${queue}`)
  })
  worker.on('job', (queue, job) => {
    log.debug(`working job ${queue} ${JSON.stringify(job)}`)
  })
  worker.on('reEnqueue', (queue, job, plugin) => {
    log.debug(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`)
  })
  worker.on('success', (queue, job, result) => {
    log.debug(`job success ${queue} ${JSON.stringify(job)} >> ${result}`)
  })
  worker.on('failure', (queue, job, failure) => {
    log.debug(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`)
  })
  worker.on('error', (error, queue, job) => {
    log.debug(`error ${queue} ${JSON.stringify(job)}  >> ${error}`)
  })
  worker.on('pause', () => {
    log.debug('worker paused')
  })

  await worker.connect()
  await worker.workerCleanup() // optional: cleanup any previous improperly shutdown workers on this host
  worker.start()

  return worker
}
