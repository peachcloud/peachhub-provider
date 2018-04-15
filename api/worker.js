const Redis = require('ioredis')
const Resque = require('node-resque')
const { path } = require('ramda')

module.exports = Worker

const getRedisUrl = path(['redis', 'url'])

async function Worker (server) {
  // connect to worker queue
  const { config } = server
  const redisUrl = getRedisUrl(config)
  const queueConnection = { redis: new Redis(redisUrl) }
  const queue = new Resque.Queue({ connection: queueConnection })
  await queue.connect()
  server.set('workerQueue', queue)
}
