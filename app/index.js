const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio-client')
const authentication = require('@feathersjs/authentication-client')
const io = require('socket.io-client')

const config = require('../config')
window.config = config

const socket = io()

const client = feathers()
  .configure(socketio(socket))
  .configure(authentication({
    storage: window.localStorage
  }))
window.client = client

const { createRenderer: createStyleRenderer } = require('fela')
const { Provider: StyleProvider, ThemeProvider: StyleThemeProvider } = require('react-fela')
const { createMuiTheme, MuiThemeProvider } = require('material-ui/styles')
const { render } = require('react-dom')
const h = require('react-hyperscript')

const defaultTheme = require('./themes/default')

const App = require('./pages/landing')

const styleRenderer = createStyleRenderer()
addStyleSheet('https://fonts.googleapis.com/css?family=Roboto:300,400,500')
addStyleSheet('https://fonts.googleapis.com/icon?family=Material+Icons')

function Root () {
  return (
    h(StyleProvider, {
      renderer: styleRenderer
    }, [
      h(StyleThemeProvider, {
        theme: defaultTheme
      }, [
        h(MuiThemeProvider, {
          theme: themeToMuiTheme(defaultTheme)
        }, [
          h(App)
        ])
      ])
    ])
  )
}

const domRoot = document.createElement('div')
document.body.appendChild(domRoot)

render(
  h(Root),
  domRoot
)

function addStyleSheet (href) {
  var el = document.createElement('link')
  el.rel = 'stylesheet'
  el.href = href
  document.body.appendChild(el)
}

function themeToMuiTheme (theme) {
  const {
    colors
  } = theme

  return createMuiTheme({
    palette: colors
  })
}
