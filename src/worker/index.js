const Resque = require('node-resque')
const Redis = require('ioredis')
const { get } = require('lodash')

const config = require('../config')
const Jobs = require('../jobs')

module.exports = startWorker

async function startWorker () {
  const redisUrl = get(config, 'redis.url')
  const connection = {
    redis: new Redis(redisUrl)
  }
  const worker = await createWorker(connection)
  const scheduler = await createScheduler(connection)

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
  
  async function shutdown () {
    await scheduler.end()
    await worker.end()
    console.log('bye.')
    process.exit()
  }
}

async function createScheduler (connection) {
  const scheduler = new Resque.Scheduler({ connection })
  await scheduler.connect()
  scheduler.start()

  scheduler.on('start', () => { console.log('scheduler started') })
  scheduler.on('end', () => { console.log('scheduler ended') })
  scheduler.on('poll', () => { console.log('scheduler polling') })
  scheduler.on('master', (state) => { console.log('scheduler became master') })
  scheduler.on('error', (error) => { console.log(`scheduler error >> ${error}`) })
  scheduler.on('workingTimestamp', (timestamp) => {
    console.log(`scheduler working timestamp ${timestamp}`)
  })
  scheduler.on('transferredJob', (timestamp, job) => {
   console.log(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`)
  })

  return scheduler
}

async function createWorker (connection) {
  const queues = [
    'main' // TODO what queues?
  ]
  const jobs = Jobs(config)
  const worker = new Resque.Worker({ connection, queues }, jobs)
  await worker.connect()
  await worker.workerCleanup() // optional: cleanup any previous improperly shutdown workers on this host
  worker.start()

  worker.on('start', () => { console.log('worker started') })
  worker.on('end', () => { console.log('worker ended') })
  worker.on('cleaning_worker', (worker, pid) => { console.log(`cleaning old worker ${worker}`) })
  worker.on('poll', (queue) => { console.log(`worker polling ${queue}`) })
  worker.on('job', (queue, job) => { console.log(`working job ${queue} ${JSON.stringify(job)}`) })
  worker.on('reEnqueue', (queue, job, plugin) => { console.log(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`) })
  worker.on('success', (queue, job, result) => { console.log(`job success ${queue} ${JSON.stringify(job)} >> ${result}`) })
  worker.on('failure', (queue, job, failure) => { console.log(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`) })
  worker.on('error', (error, queue, job) => { console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`) })
  worker.on('pause', () => { console.log('worker paused') })

  return worker
}
