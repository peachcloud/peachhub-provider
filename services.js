const services = [
  require('./users/services/users'),
  require('./bots/services/bots'),
  require('./onboarding/services/email')
]

module.exports = Services

function Services (server) {
  services.forEach(service => {
    server.configure(service)
  })
}
