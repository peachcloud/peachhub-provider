const { helper: Helper } = require('codeceptjs')
const Asset = require('../../asset')

class AssetHelper extends Helper {
  constructor (config) {
    super(config)

    const { server, start, stop } = Asset()
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
    console.log('finish asset')
    return this.stop()
  }
}

module.exports = AssetHelper
