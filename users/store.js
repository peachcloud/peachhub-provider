const { createSelector } = require('redux-bundler')
const { merge, prop } = require('ramda')

module.exports = {
  name: 'users',
  getReducer: function () {
    const initialState = {
      data: null,
      isLoading: false,
      error: null
    }

    return (state = initialState, { type, user, error }) => {
      if (type === 'GET_USER_STARTED') {
        return merge(
          state,
          { isLoading: true }
        )
      } else if (type == 'GET_USER_FINISHED') {
        return merge(
          state,
          {
            data: merge(
              state.data,
              { [user.id]: user }
            ),
            error: null,
            isLoading: false
          }
        )
      } else if (type == 'GET_USER_FAILED') {
        return merge(
          state,
          {
            error,
            isLoading: false
          }
        )
      }
      return state
    }
  },
  doGetUser: (id) => ({ dispatch, client }) => {
    dispatch({ type: 'GET_USER_STARTED', id })
    client.service('users').get(id)
      .then(user => {
        dispatch({ type: 'GET_USER_FINISHED', user })
      })
      .catch(error => {
        dispatch({ type: 'GET_USER_FAILED', error })
      })
  },
  selectUsers: state => state.users.data,
  selectIsLoadingUsers: state => state.users.isLoading,
  selectUsersError: state => state.users.error,
  selectAuthenticatedUser: createSelector(
    'selectAuthenticatedUserId',
    'selectUsers',
    prop
  ),
  reactShouldFetchAuthenticatedUser: createSelector(
    'selectAuthenticatedUserId',
    'selectAuthenticatedUser',
    'selectIsLoadingUsers',
    (authUserId, authUser, isLoading) => {
      if (authUserId == null) return false
      if (isLoading || authUser != null) return false
      return { actionCreator: 'doGetUser', args: [authUserId] }
    }
  )
}
