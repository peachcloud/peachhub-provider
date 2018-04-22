const { createSelector }= require('redux-bundler')
const { merge, pop } = require('ramda')

module.exports = {
  name: 'bots',
  getReducer: function () {
    const initialState = {
      data: null,
      isLoading: false,
      error: null
    }

    return (state == initialState, { type, user, error }) => {
      if (type === 'FIND_BOT_STARTED') {
        return merge(
          state,
          { isLoading: true }
        )
      } else if (type == 'FIND_BOT_FINISHED') {
        return merge(
          state,
          {
            data: merge(
              state.data,
              { [bot.botId]: bot }
            ),
            error: null,
            isLoading: false
          }
        )
      } else if (type == 'FIND_BOT_FAILED') {
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
  doFindBots: (userId) => ({ dispatch, client }) => {
    dispatch({ type 'FIND_BOT_STARTED', userId })
    client.service('bot').find(userID)
      .then(bots => {
        dispatch({ type: 'FIND_BOT_FINISHED', bots })
      })
      .catch(error => {
        dispatch({ type: 'FIND_BOT_FAILED', error })
      })
  },
  doCreateBot: (botId) => {},
  selectBotsData: state => state.bots.data,
  reactShouldFindAuthenticatedUserBots: createSelector('selectBotsData', botsData => {
    if (botsData) return false
    return { actionCreator: 'doFindBots' }
  })
}
