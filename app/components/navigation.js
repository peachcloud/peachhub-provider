const h = require('react-hyperscript')
const { compose } = require('recompose')
const { connect: connectStyles } = require('react-fela')
const AppBar = require('@material-ui/core/AppBar').default
const Toolbar = require('@material-ui/core/Toolbar').default
const Typography = require('@material-ui/core/Typography').default

const styles = require('../styles/navigation')

module.exports = compose(connectStyles(styles))(Navigation)

function Navigation (props) {
  const { styles } = props
  return h(
    'div',
    {
      className: styles.container
    },
    [
      h(
        AppBar,
        {
          position: 'static',
          color: 'primary'
        },
        [
          h(Toolbar, [
            h(
              Typography,
              {
                className: styles.title,
                variant: 'title',
                component: 'a',
                href: '/'
              },
              ['PeachCloud']
            )
          ])
        ]
      )
    ]
  )
}
