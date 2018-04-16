const h = require('react-hyperscript')
const { compose } = require('recompose')
const { connect: connectStore } = require('redux-bundler-react')
const { partial } = require('ramda')

const Layout = require('./layout')

module.exports = compose(
  partial(connectStore, [
    'selectRoute'
  ])
)(App)

function App (props) {
  const {
    route: Page
  } = props

  return (
    h(Layout, [
      h(Page)
    ])
  )
}
