const mjml2html = require('mjml')

module.exports = OnboardingEmailService

function OnboardingEmailService (server) {
  const name = '/onboarding/email'
  server.use(name, Service())
  server.service(name).hooks(hooks)
}

const Service = () => ({
  setup (server) {
    this.log = server.get('logger')
    this.enqueue = server.enqueue
    this.workerQueue = server.get('workerQueue')
    this.assetUrl = server.get('asset').url
    this.theme = server.get('theme')
    this.users = server.service('users')
    this.from = server.get('mailer').from
  },
  async create (options) {
    const { assetUrl, from, log, theme, users } = this
    const { userId } = options

    const user = await users.get(userId)
    const setupUrl = `${assetUrl}/onboarding/1?token=${encodeURIComponent(
      user.token
    )}`

    await this.enqueue('sendMail', [
      {
        from: from,
        to: `"${user.name}" <${user.email}>`,
        subject: 'Welcome to PeachCloud!',
        text: createText({ setupUrl, user }),
        html: createHtml({ assetUrl, log, setupUrl, theme, user })
      }
    ])
  }
})

function createHtml ({ assetUrl, log, setupUrl, theme, user }) {
  const output = mjml2html(`
<mjml>
  <mj-body>
    <mj-section background-color="${theme.colors.primary.main}">
      <mj-column>
        <mj-text
          font-style="bold"
          font-size="40px"
          color="${theme.colors.primary.contrastText}"
        >
          PeachCloud
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-hero
      mode="fixed-height"
      height="469px"
      vertical-align="middle"
      background-width="600px"
      background-height="469px"
      background-url="${assetUrl}/background.svg"
      background-color="#2a3448"
      padding="100px 0px"
    >
      <mj-text
        padding="20px"
        color="${theme.colors.secondary.dark}"
        font-family="Helvetica"
        align="center"
        font-size="80px"
        line-height="80px"
        font-weight="900"
      >
        WELCOME!
      </mj-text>
      <mj-button
        href="${setupUrl}"
        align="center"
        background-color="${theme.colors.secondary.main}"
        color="${theme.colors.secondary.contrastText}"
        font-size="30px"
        line-height="30px"
        font-weight="900"
        inner-padding="15px 40px"
      >
        SETUP YOUR PUB
      </mj-button>
  </mj-body>
</mjml>
  `)

  if (output.errors.length > 0) {
    output.errors.forEach(err => log.error(err))
    throw new Error('Failed to render onboarding email!')
  }

  return output.html
}

function createText ({ user, setupUrl }) {
  return `
Welcome to PeachCloud!
=====================

[SETUP YOUR PUB](${setupUrl})
  `
}

const hooks = {
  before: {
    create: []
  }
}
