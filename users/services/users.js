const KnexService = require('feathers-knex')
const { hooks: authHooks } = require('@feathersjs/authentication')

module.exports = UsersService

function UsersService (server) {
  const sql = server.get('sql')

  const name = 'users'
  const options = { Model: sql, name }

  server.use(name, KnexService(options))
  server.service(name).hooks(hooks)
}

const hooks = {
  before: {},
  after: {}
}
