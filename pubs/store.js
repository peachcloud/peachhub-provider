const { createSelector } = require('redux-bundler')
const { groupBy, indexBy, merge, pipe, prop, propOr, values } = require('ramda')

const indexById = indexBy(prop('id'))
const groupByUserId = groupBy(prop('userId'))

module.exports = {
  name: 'pubs',
  getReducer: function () {
    const initialState = {
      data: {},
      isLoading: false,
      hasLoaded: false,
      error: null
    }

    return (state = initialState, { type, pub, pubs, error }) => {
      if (type === 'FIND_PUBS_STARTED') {
        return merge(state, { isLoading: true })
      } else if (type === 'FIND_PUBS_FINISHED') {
        return merge(state, {
          data: merge(state.data, indexById(pubs)),
          error: null,
          isLoading: false,
          hasLoaded: true
        })
      } else if (type === 'CREATE_PUB_FINISHED') {
        return merge(state, {
          data: merge(state.data, { [pub.pubId]: pub }),
          error: null,
          isLoading: false
        })
      } else if (type === 'FIND_PUBS_FAILED' || type === 'CREATE_PUB_FAILED') {
        return merge(state, {
          error,
          isLoading: false
        })
      }
      return state
    }
  },
  doFindPubs: params => ({ dispatch, client }) => {
    dispatch({ type: 'FIND_PUBS_STARTED' })
    return client
      .service('pubs')
      .find(params)
      .then(pubs => {
        dispatch({ type: 'FIND_PUBS_FINISHED', pubs })
        return pubs
      })
      .catch(error => {
        dispatch({ type: 'FIND_PUBS_FAILED', error })
        throw error
      })
  },
  doCreatePub: (data, params) => ({ dispatch, client }) => {
    dispatch({ type: 'CREATE_PUB_STARTED' })
    return client
      .service('pubs')
      .create(data, params)
      .then(pub => {
        dispatch({ type: 'CREATE_PUB_FINISHED', pub })
        return pub
      })
      .catch(error => {
        dispatch({ type: 'CREATE_PUB_FAILED', error })
        throw error
      })
  },
  selectPubs: state => console.log('state', state) || state.pubs.data,
  selectIsLoadingPubs: state => state.pubs.isLoading,
  selectHasLoadedPubs: state => state.pubs.hasLoaded,
  selectPubsByUserId: createSelector('selectPubs', pipe(values, groupByUserId)),
  selectAuthenticatedUserPubs: createSelector(
    'selectAuthenticatedUserId',
    'selectPubsByUserId',
    propOr([])
  ),
  reactShouldFindAuthenticatedUserPubs: createSelector(
    'selectIsAuthenticated',
    'selectIsLoadingPubs',
    'selectHasLoadedPubs',
    (isAuthenticated, isLoadingPubs, hasLoadedPubs) => {
      if (!isAuthenticated) return false
      if (isLoadingPubs || hasLoadedPubs) return false
      return { actionCreator: 'doFindPubs', args: [] }
    }
  )
}
