const config = require('../config')
window.config = config

const client = require('./client')
window.client = client

const view = require('./view')
view({
  config,
  client
})
