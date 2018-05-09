Feature('Onboarding setup page')

Scenario('User can complete onboarding setup', async I => {
  const user = await I.callApi('users', 'create', {
    name: 'Bob',
    email: 'bob@example.com'
  })
  console.log('user', user)
  I.waitForEmail(0) // to not confuse others tests
  I.amOnPage(`/onboarding/1?token=${user.token}`)
  I.see('ButtCloud') // TODO change to setup page text
})
