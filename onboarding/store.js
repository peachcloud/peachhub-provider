const { createSelector } = require('redux-bundler')
const { merge, partialRight, path, pipe, prop, __ } = require('ramda')
const { SubmissionError } = require('redux-form')

const steps = require('./data/steps')
const ONBOARDING_USER = 'buttcloud_onboardingUser'

module.exports = {
  name: 'onboarding',
  getReducer: () => {
    const initialState = {
      user: null,
      snackbar: {
        message: null,
        error: null
      }
    }

    return (state = initialState, action) => {
      const { type } = action
      if (type === 'ONBOARDING_USER') {
        const { user } = action
        return merge(
          state,
          { user }
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
  selectOnboardingStoredUser: path(['onboarding', 'user']),
  selectOnboardingUser: createSelector(
    'selectOnboardingStoredUser',
    'selectAuthenticatedUser',
    (storedUser, authenticatedUser) => {
      return authenticatedUser || storedUser
    }
  ),
  selectIsOnboarding: createSelector(
    'selectRouteParams',
    (routeParams) => routeParams.hasOwnProperty('onboardingStepIndex')
  ),
  selectOnboardingStepIndex: createSelector(
    'selectRouteParams',
    pipe(prop('onboardingStepIndex'), Number)
  ),
  selectOnboardingSteps: createSelector(
    'selectOnboardingStepIndex',
    (stepIndex) => {
      return steps.map((step, index) => {
        const isComplete = stepIndex > index
        return merge(step, {
          isComplete
        })
      })
    }
  ),
  selectOnboardingStep: createSelector(
    'selectOnboardingStepIndex',
    prop(__, steps)
  ),
  doClearOnboardingUser: () => ({ dispatch }) => {
    window.localStorage.removeItem(ONBOARDING_USER)
    dispatch({ type: 'ONBOARDING_USER', user: null })
  },
  doResendOnboardingEmail: (userId) => ({ dispatch, client }) => {
    return client.service('onboarding/email')
      .create({ userId })
      .catch(err => {
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
  doSubmitOnboardingStart: (data) => ({ dispatch, client }) => {
    return client.service('users')
      .create(data)
      .then(user => {
        const userString = JSON.stringify(user)
        window.localStorage.setItem(ONBOARDING_USER, userString)

        dispatch({
          type: 'ONBOARDING_USER',
          user
        })

        const { name, email } = user
        dispatch({
          type: 'ONBOARDING_SNACKBAR_SET',
          snackbar: {
            message: `Hey ${name}, we sent you an email at ${email} with a link to continue with ButtCloud!`,
            error: false
          }
        })
      })
      .catch(err => {
        if (err.errors && Object.keys(err.errors) > 0) throw new SubmissionError(err.errors)

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
    'selectIsAuthenticated',
    (isOnboarding, stepIndex, isAuthenticated) => {
      if (!isOnboarding) return false

      // if out-of-bounds, reset to step 0
      if (
        stepIndex == null ||
        stepIndex < 0 ||
        stepIndex >= steps.length
      ) {
        return {
          actionCreator: 'doUpdateUrl',
          args: ['/onboarding/0']
        }
      }

      // if authenticated, at least step 1
      if (isAuthenticated && stepIndex < 1) {
        return {
          actionCreator: 'doUpdateUrl',
          args: ['/onboarding/1']
        }
      }
    }
  ),
  reactClearOnboardingUserWhenAuthenticatedUser: createSelector(
    'selectAuthenticatedUser',
    'selectOnboardingStoredUser',
    (authenticatedUser, onboardingUser) => {
      if (!authenticatedUser) return false
      if (!onboardingUser) return false
      return { actionCreator: 'doClearOnboardingUser' }
    }
  ),
  init: function (store) {
    const userString = window.localStorage.getItem(ONBOARDING_USER)
    if (userString != null) {
      try {
        const user = JSON.parse(userString)
        store.dispatch({ type: 'ONBOARDING_USER', user })
      } catch (err) {}
    }
  }
}
