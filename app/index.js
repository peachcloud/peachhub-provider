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
const App = require('./components/app')

const styleRenderer = createStyleRenderer()
addStyleSheet('https://fonts.googleapis.com/css?family=Roboto:300,400,500')
addStyleSheet('https://fonts.googleapis.com/icon?family=Material+Icons')

styleRenderer.renderStatic(`
  html, body, .root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
`)

const domRoot = document.createElement('div')
domRoot.className = 'root'
document.body.appendChild(domRoot)

render(
  h(App, {
    styleRenderer,
    theme: defaultTheme
  }),
  domRoot
)

function addStyleSheet (href) {
  var el = document.createElement('link')
  el.rel = 'stylesheet'
  el.href = href
  document.body.appendChild(el)
}
