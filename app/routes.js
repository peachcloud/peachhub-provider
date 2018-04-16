const { createRouteBundle } = require('redux-bundler')

module.exports = createRouteBundle({
  '/': require('./components/landing'),
  '/onboarding/:onboardingStepIndex': require('../onboarding/components/onboarding'),
  '*': require('./components/not-found')
})
