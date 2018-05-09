Feature('Onboarding start page')

Scenario('User can navigate to start onboarding from home page', I => {
  I.amOnPage('/')
  I.click('[id="start-onboarding"]')
  I.seeInCurrentUrl('/onboarding/0')
})

Scenario('Name is required', I => {
  I.fillField('form input[name="name"]', 'Alice')
  I.click('form input[name="email"]')
  I.clearInputField('form input[name="name"]', 'Alice')
  I.click('form input[name="email"]')
  I.see("should have required property 'name'")
  I.fillField('form input[name="name"]', 'Alice')
})

Scenario('Email is required and validated', I => {
  I.fillField('form input[name=email]', 'not an email')
  I.click('form input[name="name"]')
  I.see('should match format "email"')
  I.clearInputField('form input[name=email]', 'not an email')
  I.click('form input[name="name"]')
  I.see("should have required property 'email'")
  I.fillField('form input[name="email"]', 'alice@example.com')
})

Scenario('User can complete onboarding start', async I => {
  I.click('form [type="submit"]')
  I.waitForText('Hey Alice', 3)
  I.waitForEmail(0)
  I.seeEmail(0, {
    to: [
      {
        name: 'Alice',
        address: 'alice@example.com'
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
  const [onboardingLink] = await I.grabTextFromEmail(
    0,
    /\/onboarding\/1\?token=[^()]+/
  )
  I.amOnPage(onboardingLink)
  I.see('ButtCloud') // TODO change to next page text
})
