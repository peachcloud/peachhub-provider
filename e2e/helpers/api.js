const { helper: Helper } = require('codeceptjs')
const Api = require('../../api')

class ApiHelper extends Helper {
  constructor (config) {
    super(config)

    const { server, start, stop } = Api()
    this.server = server
    this.start = start
    this.stop = stop
    this.started = false
  }

  _init () {
    if (this.started) return
    this.started = true
    return this.start()
  }

  _finishTest () {
    return this.stop()
  }

  callApi (service, method, ...args) {
    return this.server.service(service)[method](...args)
  }
}

module.exports = ApiHelper
