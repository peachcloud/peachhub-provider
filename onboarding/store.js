const { createSelector } = require('redux-bundler')
const { FORM_ERROR } = require('final-form')
const { merge, path, pipe, prop, __ } = require('ramda')

const steps = require('./data/steps')
const ONBOARDING_USER = 'buttcloud_onboardingUser'
const ONBOARDING_PUB = 'buttcloud_onboardingPub'

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
        return merge(state, { user })
      } else if (type === 'ONBOARDING_SNACKBAR_SET') {
        return merge(state, {
          snackbar: merge(state.snackbar, action.snackbar)
        })
      } else if (type === 'ONBOARDING_SNACKBAR_CLEAR') {
        return merge(state, {
          snackbar: merge(state.snackbar, initialState.snackbar)
        })
      } else if (type === 'ONBOARDING_PUB') {
        const { pub } = action
        return merge(state, { pub })
      }
      return state
    }
  },
  selectOnboardingSnackbar: path(['onboarding', 'snackbar']),
  selectOnboardingStoredUser: path(['onboarding', 'user']),
  selectOnboardingPub: path(['onboarding', 'pub']),
  selectOnboardingUser: createSelector(
    'selectOnboardingStoredUser',
    'selectAuthenticatedUser',
    (storedUser, authenticatedUser) => {
      return authenticatedUser || storedUser
    }
  ),
  selectIsOnboarding: createSelector('selectRouteParams', routeParams =>
    routeParams.hasOwnProperty('onboardingStepIndex')
  ),
  selectOnboardingStepIndex: createSelector(
    'selectRouteParams',
    pipe(prop('onboardingStepIndex'), Number)
  ),
  selectOnboardingSteps: createSelector(
    'selectOnboardingStepIndex',
    stepIndex => {
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
  doResendOnboardingEmail: userId => ({ dispatch, client }) => {
    return client
      .service('onboarding/email')
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
  doSubmitOnboardingStart: data => ({ dispatch, client }) => {
    return client
      .service('users')
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
        // TODO these currently don't show up in `redux-form-material-ui` components
        // because in `final-form` this shows up as a field-level `submitError` not `error`
        if (err.errors && Object.keys(err.errors).length > 0) {
          return err.errors
        }

        // TODO use `final-form` form-level `submitError` and remove snackbar for errors
        // https://codesandbox.io/s/9y9om95lyp

        dispatch({
          type: 'ONBOARDING_SNACKBAR_SET',
          snackbar: {
            message: err.message,
            error: true
          }
        })

        return { [FORM_ERROR]: err.message }
      })
  },
  doClearOnboardingSnackbar: () => ({ dispatch }) => {
    dispatch({ type: 'ONBOARDING_SNACKBAR_CLEAR' })
  },
  doSubmitOnboardingSetup: data => ({ dispatch, client }) => {
    return client
      .service('pubs')
      .create(data)
      .then(pub => {
        dispatch({
          type: 'ONBOARDING_PUB',
          pub
        })

        const pubString = JSON.stringify(pub)
        window.localStorage.setItem(ONBOARDING_PUB, pubString)

        const { name } = pub
        dispatch({
          type: 'ONBOARDING_SNACKBAR_SET',
          snackbar: {
            message: `pub ${name} is being created`,
            error: false
          }
        })
      })
      .catch(err => {
        // TODO these currently don't show up in `redux-form-material-ui` components
        // because in `final-form` this shows up as a field-level `submitError` not `error`
        if (err.errors && Object.keys(err.errors).length > 0) {
          return err.errors
        }

        // TODO use `final-form` form-level `submitError` and remove snackbar for errors
        // https://codesandbox.io/s/9y9om95lyp

        dispatch({
          type: 'ONBOARDING_SNACKBAR_SET',
          snackbar: {
            message: err.message,
            error: true
          }
        })

        return { [FORM_ERROR]: err.message }
      })
  },
  reactShouldUpdateOnboardingStepIndex: createSelector(
    'selectIsOnboarding',
    'selectOnboardingStepIndex',
    'selectIsAuthenticated',
    'selectOnboardingPub',
    (isOnboarding, stepIndex, isAuthenticated, onboardingPub) => {
      if (!isOnboarding) return false

      // if out-of-bounds, reset to step 0
      if (stepIndex == null || stepIndex < 0 || stepIndex >= steps.length) {
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

      if (onboardingPub && isAuthenticated && stepIndex === 1) {
        return {
          actionCreator: 'doUpdateUrl',
          args: ['/onboarding/2']
        }
      }
    }
  ),
  reactShouldClearOnboardingUserWhenAuthenticatedUser: createSelector(
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
    const pubString = window.localStorage.getItem(ONBOARDING_PUB)
    if (userString != null) {
      try {
        const user = JSON.parse(userString)
        store.dispatch({ type: 'ONBOARDING_USER', user })
      } catch (err) {}
    }
    if (pubString != null) {
      try {
        const pub = JSON.parse(pubString)
        store.dispatch({ type: 'ONBOARDING_PUB', pub })
      } catch (err) {}
    }
  }
}
