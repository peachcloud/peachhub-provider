const { createSelector } = require('redux-bundler')
const { merge } = require('ramda')

module.exports = {
  name: 'bots',
  getReducer: function () {
    const initialState = {
      data: null,
      isLoading: false,
      error: null
    }

    return (state = initialState, { type, bot, error }) => {
      if (type === 'FIND_BOTS_STARTED') {
        return merge(state, { isLoading: true })
      } else if (type === 'FIND_BOTS_FINISHED') {
        return merge(state, {
          data: merge(state.data, { [bot.botId]: bot }),
          error: null,
          isLoading: false
        })
      } else if (type === 'FIND_BOTS_FAILED') {
        return merge(state, {
          error,
          isLoading: false
        })
      }
      return state
    }
  },
  doFindBots: data => ({ dispatch, client }) => {
    dispatch({ type: 'FIND_BOTS_STARTED' })
    client
      .service('bot')
      .find(data)
      .then(bots => {
        dispatch({ type: 'FIND_BOTS_FINISHED', bots })
      })
      .catch(error => {
        dispatch({ type: 'FIND_BOTS_FAILED', error })
      })
  },
  doCreateBot: botId => {},
  selectBotsData: state => state.bots.data,
  reactShouldFindAuthenticatedUserBots: createSelector(
    'selectBotsData',
    botsData => {
      if (botsData) return false
      return { actionCreator: 'doFindBots' }
    }
  )
}
