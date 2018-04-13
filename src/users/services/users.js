const MemoryService = require('feathers-memory')
const { hooks: authHooks } = require('@feathersjs/authentication')

module.exports = UsersService

function UsersService (server) {
  // const db = server.get('db')

  const name = 'users'
  // const options = { Model: db, name }

  // app.use(name, KnexService(options))
  server.use(name, MemoryService())
  server.service(name).hooks(hooks)
}

const hooks = {
  before: {},
  after: {}
}
