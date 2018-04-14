const h = require('react-hyperscript')
const { compose } = require('recompose')
const { connect: connectStyles } = require('react-fela')
const CssBaseline = require('material-ui/CssBaseline').default

const styles = require('../styles/layout')
const Navigation = require('./navigation')

module.exports = compose(
  connectStyles(styles)
)(Layout)

function Layout (props) {
  const {
    styles,
    children
  } = props

  return h('div', {
    className: styles.container
  }, [
    h(CssBaseline),
    h(Navigation),
    children
  ])
}
