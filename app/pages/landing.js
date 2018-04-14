const h = require('react-hyperscript')
const { compose } = require('recompose') 
const { connect: connectStyles } = require('react-fela')
const Typography = require('material-ui/Typography').default

const styles = require('../styles/landing')

module.exports = compose(
  connectStyles(styles)
)(Landing)
  
function Landing (props) {
  const {
    styles
  } = props

  return (
    h('div', {
      className: styles.container,
    }, [
      h('header', {
        className: styles.header
      }, [
        h(Typography, {
          variant: 'display4',
          color: 'default',
          align: 'center'
        }, [
          'ButtCloud!'
        ])
      ])
    ])
  )
}
