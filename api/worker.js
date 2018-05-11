const Redis = require('ioredis')
const Resque = require('node-resque')
const { path } = require('ramda')

module.exports = Worker

const getRedisUrl = path(['redis', 'url'])

async function Worker (server) {
  // connect to worker queue
  const { config } = server
  const redisUrl = getRedisUrl(config)
  const redis = new Redis(redisUrl)
  server.set('redis', redis)
  const queueConnection = { redis }
  const queue = new Resque.Queue({ connection: queueConnection })
  await queue.connect()
  server.set('queue', queue)
  server.enqueue = function enqueue (jobName, args) {
    return queue.enqueue(config.worker.queue, jobName, args)
  }
}
