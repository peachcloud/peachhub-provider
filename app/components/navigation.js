const h = require('react-hyperscript')
const { compose, withState, withHandlers } = require('recompose')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { partial } = require('ramda')
const AppBar = require('@material-ui/core/AppBar').default
const Toolbar = require('@material-ui/core/Toolbar').default
const Typography = require('@material-ui/core/Typography').default
const Menu = require('@material-ui/core/Menu').default
const MenuItem = require('@material-ui/core/MenuItem').default
const IconButton = require('@material-ui/core/IconButton').default
const Icon = require('@material-ui/core/Icon').default

const styles = require('../styles/navigation')

module.exports = compose(
  connectStyles(styles),
  partial(connectStore, ['selectIsAuthenticated']),
  withState('accountAnchorElement', 'setAccountAnchorElement', null),
  withHandlers({
    handleAccountMenuOpen: ({ setAccountAnchorElement }) => event =>
      setAccountAnchorElement(event.currentTarget),
    handleAccountMenuClose: ({ setAccountAnchorElement }) => () =>
      setAccountAnchorElement(null)
  })
)(Navigation)

function Navigation (props) {
  const { styles, isAuthenticated } = props

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
            ),
            isAuthenticated && h(AccountNavigation, props)
          ])
        ]
      )
    ]
  )
}

function AccountNavigation (props) {
  const {
    handleAccountMenuOpen,
    handleAccountMenuClose,
    accountAnchorElement
  } = props

  const isAccountMenuOpen = Boolean(accountAnchorElement)

  return h('div', [
    h(
      IconButton,
      {
        'aria-owns': isAccountMenuOpen ? 'menu-appbar' : null,
        'aria-haspopup': 'true',
        onClick: handleAccountMenuOpen,
        color: 'inherit'
      },
      [h(Icon, 'account_circle')]
    ),
    h(
      Menu,
      {
        id: 'menu-appbar',
        anchorEl: accountAnchorElement,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        open: isAccountMenuOpen,
        onClose: handleAccountMenuClose
      },
      [
        h(
          MenuItem,
          {
            onClick: handleAccountMenuClose
          },
          ['Logout']
        )
      ]
    )
  ])
}
