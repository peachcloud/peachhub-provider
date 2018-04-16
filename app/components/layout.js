const h = require('react-hyperscript')
const { compose } = require('recompose')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { partial } = require('ramda')
const CssBaseline = require('material-ui/CssBaseline').default
const navHelper = require('internal-nav-helper')

const styles = require('../styles/layout')
const Navigation = require('./navigation')

module.exports = compose(
  connectStyles(styles),
  partial(connectStore, [
    'doUpdateUrl'
  ])
)(Layout)

function Layout (props) {
  const {
    styles,
    children,
    doUpdateUrl
  } = props

  return h('div', {
    className: styles.container,
    onClick: navHelper(doUpdateUrl)
  }, [
    h(CssBaseline),
    h(Navigation),
    children
  ])
}
