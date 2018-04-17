const { createSelector } = require('redux-bundler')
const { dissoc, merge } = require('ramda')

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
    return client.authenticate(options)
      .then(({ accessToken }) => {
        return client.passport.verifyJWT(accessToken)
      })
      .then(payload => {
        console.log('payload', payload)
        const { userId } = payload
        if (userId == null) {
          throw new Error('doAuthenticate: missing userId from decoded jwt')
        }
        dispatch({ type: 'AUTHENTICATION_FINISHED', userId })
      })
      .catch(error => {
        dispatch({ type: 'AUTHENTICATION_FAILED', error })
        return client.logout()
      })
  },
  doAuthenticateTokenAndSetUrl: ({ accessToken, url }) => ({ dispatch }) => {
    dispatch({
      actionCreator: 'doAuthenticate',
      args: [
        {
          strategy: 'jwt',
          accessToken
        }
      ]
    })
    dispatch({ actionCreator: 'doUpdateUrl', args: [url] })
  },
  selectAuthenticatedUserId: state => state.authentication.userId,
  selectIsAuthenticating: state => state.authentication.isAuthenticating,
  selectAuthenticationError: state => state.authentication.error,
  selectIsAuthenticated: createSelector(
    'selectAuthenticatedUserId',
    Boolean
  ),
  reactShouldAutoAuthenticate: createSelector(
    'selectAuthenticatedUserId',
    'selectIsAuthenticating',
    'selectAuthenticationError',
    (authenticatedUserId, isAuthenticating, authenticationError) => {
      if (isAuthenticating) return false
      if (authenticatedUserId != null) return false
      if (authenticationError != null) return false
      return { actionCreator: 'doAuthenticate' }
    }
  ),
  reactShouldTokenAuthenticate: createSelector(
    'selectIsAuthenticating',
    'selectPathname',
    'selectQueryObject',
    'selectHashObject',
    (isAuthenticating, pathname, query, hash) => {
      if (isAuthenticating) return false
      const { token: accessToken } = query
      if (accessToken == null) return false
      const nextQuery = dissoc('token', query)

      return {
        actionCreator: 'doAuthenticateTokenAndSetUrl',
        args: [
          {
            accessToken,
            url: {
              pathname,
              query: nextQuery,
              hash
            }
          }
        ]
      }
    }
  )
}
