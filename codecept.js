const config = require('./config/test')

const browserUrl = config.asset.url

module.exports.config = {
  tests: './*/e2e/*.e2e.js',
  timeout: 10000,
  output: './e2e/output',
  helpers: {
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
    mailer: Object.assign(
      {
        require: './e2e/helpers/mailer'
      },
      config.mailer
    ),
    Nightmare: {
      disableScreenshots: 'true',
      browser: 'chrome',
      url: browserUrl,
      show: true,
      restart: false
    },
    worker: Object.assign(
      {
        require: './e2e/helpers/worker'
      },
      config.worker
    )
  },
  include: {
    I: './e2e/steps.js'
  },
  bootstrap: false,
  teardown: () => {
    process.exit()
  },
  mocha: {},
  name: 'butthub-provider'
}
