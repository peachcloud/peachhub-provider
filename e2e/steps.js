module.exports = function () {
  return actor({
    loginAs: function (userId) {
      this.amOnPage('/?token=')
      this.fillField('form input[name=email]', 'joevanbo@protonmail.com')
      this.fillField('form input[name=password]', 'pokemonred')
      this.click('form button[type=submit]')
      this.wait(1)
    },
    clearMailDev: function () {
      this.amOnPage('http://localhost:1080/#/')
      this.click('//a[contains(., "Clear Inbox")]')
    }
  })
}
