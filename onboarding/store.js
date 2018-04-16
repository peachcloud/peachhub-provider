const { createSelector } = require('redux-bundler')
const { pipe, prop, __ } = require('ramda')

const steps = require('./data/steps')

module.exports = {
  name: 'onboarding',
  doCompleteStartStep: (details) => ({ dispatch, client }) => {
    console.log('start step complete', details)
  },
  selectIsOnboarding: createSelector(
    'selectRouteParams',
    (routeParams) => routeParams.hasOwnProperty('onboardingStep')
  ),
  selectOnboardingStepIndex: createSelector(
    'selectRouteParams',
    pipe(prop('onboardingStepIndex'), Number)
  ),
  selectOnboardingStep: createSelector(
    'selectOnboardingStepIndex',
    prop(__, steps)
  ),
  reactEnsureValidOnboardingStepIndex: createSelector(
    'selectIsOnboarding',
    'selectOnboardingStepIndex',
    (isOnboarding, step) => {
      if (!isOnboarding) return false
      debugger
      if (
        step != null &&
        step >= 0 ||
        step < steps.length
      ) return false
      return {
        actionCreator: 'doUpdateUrl',
        args: ['/onboarding/0']
      }
    }
  )
}
