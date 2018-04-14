const h = require('react-hyperscript')

const Provider = require('./provider')
const Layout = require('./layout')
const Page = require('../pages/landing')

module.exports = App

function App (props) {
  const {
    styleRenderer,
    theme
  } = props

  return (
    h(Provider, {
      styleRenderer,
      theme
    }, [
      h(Layout, [
        h(Page)
      ])
    ])
  )
}
