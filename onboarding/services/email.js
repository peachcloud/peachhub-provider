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
    const setupUrl = `${assetUrl}/onboarding/1`

    await this.workerQueue.enqueue(
      'mailer',
      'sendMail',
      [
        {
          from: from,
          to: `"${user.name}" <${user.email}>`,
          subject: "Welcome to ButtCloud!",
          text: createText({ setupUrl, user }),
          html: createHtml({ assetUrl, log, setupUrl, theme, user })
        }
      ]
    )
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
          ButtCloud
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-hero
      mode="fixed-height"
      height="469px"
      width="100%"
      background-width="600px"
      background-height="469px"
      background-url="${assetUrl}/background.svg"
      background-color="#2a3448"
      padding="100px 0px"
    >
      <mj-wrapper
        width="300px"
        padding-left="100px"
        padding-right="100px"
        background-color="${theme.colors.greys[2]}"
      >
        <mj-text
          padding-top="20px"
          padding-left="20px"
          padding-right="20px"
          padding-bottom="40px"
          color="${theme.colors.secondary.main}"
          font-family="Helvetica"
          align="center"
          font-size="45px"
          line-height="45px"
          font-weight="900"
        >
          Hey ${user.name}!
        </mj-text>
        <mj-button
          href="${setupUrl}"
          align="center"
          background-color="${theme.colors.secondary.dark}"
          color="${theme.colors.secondary.contrastText}"
        >
          SETUP YOUR PUB
        </mj-button>
      </mj-wrapper>
  </mj-body>
</mjml>
  `)
  if (output.errors) {
    output.errors.forEach(err => log.error(err))
  }

  return output.html
}

function createText ({ user, setupUrl }) {
  return `
Welcome to ButtCloud!
=====================

[SETUP YOUR PUB](${setupUrl})
  `
}


const hooks = {
  before: {
    create: []
  }
}

