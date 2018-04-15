const { createSelector } = require('redux-bundler')
const { merge } = require('ramda')

module.exports = {
  name: 'authentication',
  getReducer: function () {
    const initialData = {
      userId: null,
      isAuthenticating: false,
      error: null
    }

    return (state = initialData, { type, userId, error }) => {
      if (type === 'AUTHENTICATION_STARTED') {
        return merge(
          state,
          { isAuthenticating: true }
        )
      } else if (type == 'AUTHENTICATION_FINISHED') {
        return merge(
          state,
          {
            userId,
            error: null,
            isAuthenticating: false
          }
        )
      } else if (type == 'AUTHENTICATION_FAILED') {
        return merge(
          state,
          {
            error,
            isAuthenticating: false
          }
        )
      }
      return state
    }
  },
  doAuthenticate: (options) => ({ dispatch, client }) => {
    dispatch({ type: 'AUTHENTICATION_STARTED' })
    client.authenticate(options)
      .then(user => {
        dispatch({ type: 'AUTHENTICATION_FINISHED', user })
      })
      .catch(error => {
        dispatch({ type: 'AUTHENTICATION_FAILED', error })
      })
  },
  selectAuthenticatedUserId: state => state.authentication.userId,
  selectIsAuthenticating: state => state.authentication.isAuthenticating,
  selectAuthenticationError: state => state.authentication.error,
  reactShouldAuthenticate: createSelector(
    'selectAuthenticatedUserId',
    'selectIsAuthenticating',
    'selectAuthenticationError',
    (authenticatedUserId, isAuthenticating, authenticationError) => {
      if (authenticatedUserId != null) return false
      if (isAuthenticating) return false
      if (authenticationError != null) return false
      return { actionCreator: 'doAuthenticate' }
    }
  )
}
