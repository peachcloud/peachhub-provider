Feature('Onboarding start page')

Scenario('User can navigate to start onboarding from home page', I => {
  I.amOnPage('/')
  I.click('[id="start-onboarding"]')
  I.seeInCurrentUrl('/onboarding/0')
})

Scenario('User can complete onboarding start', I => {
  I.amOnPage('/onboarding/0')
  I.fillField('form input[name="name"]', 'Tester')
  I.fillField('form input[name="email"]', 'tester@example.com')
  I.click('form [type="submit"]')
  I.waitForText('Hey Tester', 3)
  I.seeEmail({
    to: [
      {
        name: 'Tester',
        address: 'tester@example.com'
      }
    ],
    from: [
      {
        name: 'ButtCloud',
        address: 'hello@buttcloud.org'
      }
    ],
    text: '/onboarding/1?token=',
    html: '/onboarding/1?token='
  })
})
