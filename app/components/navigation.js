const h = require('react-hyperscript')
const { compose } = require('recompose')
const { connect: connectStyles } = require('react-fela')
const AppBar = require('material-ui/AppBar').default
const Toolbar = require('material-ui/Toolbar').default
const Typography = require('material-ui/Typography').default

const styles = require('../styles/navigation')

module.exports = compose(
  connectStyles(styles)
)(Navigation)

function Navigation (props) {
  const {
    styles
  } = props
  return (
    h('div', {
      className: styles.container
    }, [
      h(AppBar, {
        position: 'static',
        color: 'default'
      }, [
        h(Toolbar, [
          h(Typography, {
            variant: 'title',
            color: 'inherit'
          }, [
            'ButtCloud'
          ])
        ])
      ])
    ])
  )
}

