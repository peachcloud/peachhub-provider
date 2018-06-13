Feature('Onboarding setup page')

Scenario('User is redirected to proper step in onboarding', async I => {
  const user = await I.callApi('users', 'create', {
    name: 'Bonnie',
    email: 'bonnie@example.com'
  })
  I.waitForEmail(0) // to not confuse others tests
  I.amOnPage(`/?token=${user.token}`)
  I.click('[id="start-onboarding"]')
  I.seeInCurrentUrl('/onboarding/1')
})

Scenario('Pub name is required', async I => {
  const user = await I.callApi('users', 'create', {
    name: 'Bea',
    email: 'bea@example.com'
  })
  I.waitForEmail(0) // to not confuse others tests
  I.amOnPage(`/onboarding/1?token=${user.token}`)
  I.fillField('form input[name="name"]', 'Pubby')
  I.click('form input[name="slug"]')
  I.clearInputField('form input[name="name"]', 'Pubby')
  I.click('form input[name="slug"]')
  I.see("should have required property 'name'")
})

Scenario('Pub slug is required and validated', async I => {
  const user = await I.callApi('users', 'create', {
    name: 'Bali',
    email: 'bali@example.com'
  })
  I.waitForEmail(0) // to not confuse others tests
  I.amOnPage(`/onboarding/1?token=${user.token}`)
  I.fillField('form input[name="slug"]', 'Pubby McPubFace')
  I.click('form input[name="name"]')
  I.see('should match pattern "^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]|[a-z0-9]$"')
  I.clearInputField('form input[name="slug"]', 'pubby')
  I.click('form input[name="name"]')
  I.see("should have required property 'slug'")
})

Scenario('User can complete onboarding setup', async I => {
  const user = await I.callApi('users', 'create', {
    name: 'Bob',
    email: 'bob@example.com'
  })
  I.waitForEmail(0) // to not confuse others tests
  I.amOnPage(`/onboarding/1?token=${user.token}`)
  I.see('What should we call your pub?')
  I.fillField('form input[name="name"]', 'Pubby McPubFace')
  I.fillField('form input[name="slug"]', 'pubby-mcpubface')
  I.click('form [type="submit"]')
  I.seeInCurrentUrl('/onboarding/2')
  I.amOnPage(`/onboarding/0`)
  I.wait(2)
  I.seeInCurrentUrl('/onboarding/2')
})
