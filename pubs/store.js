const { createSelector } = require('redux-bundler')
const { merge } = require('ramda')

module.exports = {
  name: 'pubs',
  getReducer: function () {
    const initialState = {
      data: null,
      isLoading: false,
      error: null
    }

    return (state = initialState, { type, pub, error }) => {
      if (type === 'FIND_PUBS_STARTED') {
        return merge(state, { isLoading: true })
      } else if (type === 'FIND_PUBS_FINISHED') {
        return merge(state, {
          data: merge(state.data, { [pub.pubId]: pub }),
          error: null,
          isLoading: false
        })
      } else if (type === 'FIND_PUBS_FAILED') {
        return merge(state, {
          error,
          isLoading: false
        })
      }
      return state
    }
  },
  doFindpubs: params => ({ dispatch, client }) => {
    dispatch({ type: 'FIND_PUBS_STARTED' })
    client
      .service('pub')
      .find(params)
      .then(pubs => {
        dispatch({ type: 'FIND_PUBS_FINISHED', pubs })
      })
      .catch(error => {
        dispatch({ type: 'FIND_PUBS_FAILED', error })
      })
  },
  doCreatePub: pubId => {},
  selectPubsData: state => state.pubs.data,
  reactShouldFindAuthenticatedUserpubs: createSelector(
    'selectPubsData',
    pubsData => {
      if (pubsData) return false
      return { actionCreator: 'doFindPubs' }
    }
  )
}
