const h = require('react-hyperscript')
const { compose } = require('recompose') 
const { connect: connectStyles } = require('react-fela')

const styles = require('../styles/landing')

module.exports = compose(
  connectStyles(styles)
)(Landing)
  
function Landing (props) {
  return (
    h('h1', [
      'ButtCloud!'
    ])
  )
}
