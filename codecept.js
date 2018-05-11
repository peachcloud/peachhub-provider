const config = require('./config/test')

const browserUrl = config.asset.url

module.exports.config = {
  tests: './*/e2e/*.e2e.js',
  timeout: 10000,
  output: './e2e/output',
  helpers: {
    worker: Object.assign(
      {
        require: './e2e/helpers/worker'
      },
      config.worker
    ),
    mailer: Object.assign(
      {
        require: './e2e/helpers/mailer'
      },
      config.mailer
    ),
    // api must close after worker
    // (mw) why?
    api: Object.assign(
      {
        require: './e2e/helpers/api'
      },
      config.api
    ),
    asset: Object.assign(
      {
        require: './e2e/helpers/asset'
      },
      config.asset
    ),
    Nightmare: {
      gotoTimeout: 120000,
      disableScreenshots: 'true',
      browser: 'chrome',
      url: browserUrl,
      show: true,
      restart: false
    }
  },
  include: {
    I: './e2e/steps.js'
  },
  mocha: {},
  name: 'butthub-provider'
}
