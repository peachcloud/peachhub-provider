Feature('Home page')

Scenario('User sees the ButtCloud home page', I => {
  I.amOnPage('/')
  I.see('ButtCloud')
})
