// custom functions appended to Codecept's 'I' object.
module.exports = function () {
  return actor({
    loginAs: async function (user) {
      user = await this.callApi('users', 'create', user)
      this.waitForEmail(0) // so as not to upset other tests
      this.amOnPage(`/?token=${user.token}`)
      this.wait(1)
      return user
    },
    // required because: known bug with codecept's I.clearField() when using nightmare/react: https://github.com/Codeception/CodeceptJS/issues/499
    clearInputField: function (selector, text) {
      let backspaces = ''
      for (let i = 0; i < text.length; i++) {
        backspaces += '\u0008'
      }
      this.fillField(selector, backspaces)
    }
  })
}
