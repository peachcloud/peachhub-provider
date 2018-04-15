localStorage.setItem('debug', true)

const config = require('../config')
window.config = config

const createStore = require('./store')
const store = createStore()

const view = require('./view')
view({
  config,
  store
})
