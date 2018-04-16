const { composeBundles } = require('redux-bundler')
const { reducer: formReducer } = require('redux-form')

const config = require('../config')
const createClient = require('./client')

const appBundle = {
  name: 'app',
  getExtraArgs: (store) => {
    return {
      config,
      client: createClient(config)
    }
  }
}

const formBundle = {
  name: 'form',
  reducer: formReducer
}

module.exports = composeBundles(
  appBundle,
  formBundle,
  require('./routes'),
  require('../authentication/store'),
  require('../users/store'),
  require('../onboarding/store')
)
