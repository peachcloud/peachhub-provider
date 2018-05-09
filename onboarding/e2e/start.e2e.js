Feature('Onboarding start page')

Scenario('User can navigate to start onboarding from home page', I => {
  I.amOnPage('/')
  I.click('[id="start-onboarding"]')
  I.seeInCurrentUrl('/onboarding/0')
})

Scenario('User can complete onboarding start', async I => {
  I.amOnPage('/onboarding/0')
  I.fillField('form input[name="name"]', 'Alice')
  I.fillField('form input[name="email"]', 'alice@example.com')
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
