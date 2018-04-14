const { Provider: StyleProvider, ThemeProvider: StyleThemeProvider } = require('react-fela')
const { createMuiTheme, MuiThemeProvider } = require('material-ui/styles')
const h = require('react-hyperscript')

module.exports = Provider

function Provider (props) {
  const {
    styleRenderer,
    theme,
    children
  } = props

  return (
    h(StyleProvider, {
      renderer: styleRenderer
    }, [
      h(StyleThemeProvider, {
        theme
      }, [
        h(MuiThemeProvider, {
          theme: themeToMuiTheme(theme)
        }, children)
      ])
    ])
  )
}

function themeToMuiTheme (theme) {
  const {
    colors
  } = theme

  return createMuiTheme({
    palette: colors
  })
}
