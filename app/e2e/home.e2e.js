Feature('Home page')

Scenario('User sees the PeachCloud home page', I => {
  I.amOnPage('/')
  I.see('PeachCloud')
})
