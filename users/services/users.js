const KnexService = require('feathers-knex')
const auth = require('@feathersjs/authentication')
const { restrictToOwner } = require('feathers-authentication-hooks')
const { disallow } = require('feathers-hooks-common')
const validateSchema = require('../../util/validateSchema')

const createSchema = require('../schemas/createUser')

module.exports = UsersService

function UsersService (server) {
  const sql = server.get('sql')

  const name = 'users'
  const options = { Model: sql, name }

  server.use(name, KnexService(options))
  server.service(name).hooks(hooks)
}

const hooks = {
  before: {
    find: disallow(),
    get: [
      auth.hooks.authenticate('jwt'),
      restrictToOwner({
        idField: 'id',
        ownerField: 'id'
      })
    ],
    create: validateSchema(createSchema),
    update: disallow(),
    patch: disallow(),
    remove: disallow(),
  },
  after: {}
}
