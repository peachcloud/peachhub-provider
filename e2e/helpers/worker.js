const { helper: Helper } = require('codeceptjs')
const Worker = require('../../worker')

class WorkerHelper extends Helper {
  constructor (config) {
    super(config)

    const { start, stop } = Worker()
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
}

module.exports = WorkerHelper
