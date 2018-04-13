const configuration = require('@feathersjs/configuration')

const config = configuration()()

config.browser = {
  web: config.web,
  assets: config.assets
}

module.exports = config
