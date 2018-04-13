module.exports = () => {
  const config = require('./')
  return {
    code: `module.exports = JSON.parse(${JSON.stringify(config.browser)})`
  }
}
