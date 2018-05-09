const services = [
  require('./users/services/users'),
  require('./pubs/services/pubs'),
  require('./onboarding/services/email')
]

module.exports = Services

function Services (server) {
  services.forEach(service => {
    server.configure(service)
  })
}
