const stringToStream = require('string-to-stream')
const staticModule = require('static-module')
const Config = require('@feathersjs/configuration')

module.exports = Configify

function Configify (filename, options) {
  const { keys = [] } = options
  return staticModule({
    '@feathersjs/configuration': function () {
      const getConfig = Config()
      const config = getConfig() || {}
      const browserConfig = keys.reduce(
        (sofar, key) => {
          sofar[key] = config[key]
          return sofar
        },
        {}
      )
      return stringToStream(
        'function () { return ' +
          JSON.stringify(browserConfig) +
        ' }'
      )
    }
  })
}
