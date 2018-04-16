const { createSelector } = require('redux-bundler')
const { merge, partialRight, path, pipe, prop, __ } = require('ramda')
const { SubmissionError } = require('redux-form')

const steps = require('./data/steps')

module.exports = {
  name: 'onboarding',
  getReducer: () => {
    const initialState = {
      completion: steps.map(() => false),
      snackbar: {
        message: null,
        error: null
      }
    }

    return (state = initialState, action) => {
      const { type } = action
      if (type === 'ONBOARDING_COMPLETE_STEP') {
        const { stepIndex } = action
        return merge(
          state,
          {
            completion: merge(
              state.completion,
              { [stepIndex]: true }
            )
          }
        )
      }
      else if (type === 'ONBOARDING_SNACKBAR_SET') {
        return merge(
          state,
          {
            snackbar: merge(
              state.snackbar,
              action.snackbar
            )
          }
        )
      }
      else if (type === 'ONBOARDING_SNACKBAR_CLEAR') {
        return merge(
          state,
          {
            snackbar: merge(
              state.snackbar,
              initialState.snackbar
            )
          }
        )
      }
      return state
    }
  },
  selectOnboardingSnackbar: path(['onboarding', 'snackbar']),
  selectIsOnboarding: createSelector(
    'selectRouteParams',
    (routeParams) => routeParams.hasOwnProperty('onboardingStepIndex')
  ),
  selectOnboardingStepIndex: createSelector(
    'selectRouteParams',
    pipe(prop('onboardingStepIndex'), Number)
  ),
  selectOnboardingCompletion: path(['onboarding', 'completion']),
  selectOnboardingStepCompletion: createSelector(
    'selectOnboardingStepIndex',
    'selectOnboardingCompletion',
    prop
  ),
  selectOnboardingStep: createSelector(
    'selectOnboardingStepIndex',
    'selectOnboardingStepCompletion',
    (stepIndex, stepCompletion) => {
      const step = steps[stepIndex]
      return merge(step, {
        isComplete: stepCompletion
      })
    }
  ),
  doSubmitOnboardingStart: (data) => ({ dispatch, client }) => {
    return client.service('users')
      .create(data)
      .then(user => {
        const { name, email } = user
        dispatch({
          type: 'ONBOARDING_COMPLETE_STEP',
          stepIndex: 0
        })
        dispatch({
          type: 'ONBOARDING_SNACKBAR_SET',
          snackbar: {
            message: 'Sent you an email with a link to continue!',
            error: false
          }
        })
      })
      .catch(err => {
        if (err.errors) throw new SubmissionError(err.errors)

        dispatch({
          type: 'ONBOARDING_SNACKBAR_SET',
          snackbar: {
            message: err.message,
            error: true
          }
        })
        throw err
      })
  },
  doClearOnboardingSnackbar: () => ({ dispatch }) => {
    dispatch({ type: 'ONBOARDING_SNACKBAR_CLEAR' })
  },
  reactEnsureValidOnboardingStepIndex: createSelector(
    'selectIsOnboarding',
    'selectOnboardingStepIndex',
    (isOnboarding, step) => {
      if (!isOnboarding) return false
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
