const Redis = require('ioredis')
const Resque = require('node-resque')
const { get } = require('lodash')

module.exports = Worker

async function Worker (server) {
  // connect to worker queue
  const { config } = server
  const redisUrl = get(config, 'redis.url')
  const queueConnection = { redis: new Redis(redisUrl) }
  const queue = new Resque.Queue({ connection: queueConnection })
  await queue.connect()
  server.set('workerQueue', queue)
}
