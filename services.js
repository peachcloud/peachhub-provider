const services = [
  require('./users/services/users')
]

module.exports = Services

function Services (server) {
  services.forEach(service => {
    server.configure(service)
  })
}
