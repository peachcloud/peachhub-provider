const h = require('react-hyperscript')
const { compose } = require('recompose')
const { connect: connectStyles } = require('react-fela')
const Typography = require('material-ui/Typography').default

const styles = require('../styles/onboarding')

module.exports = compose(
  connectStyles(styles)
)(Onboarding)

function Onboarding (props) {
  return
}
