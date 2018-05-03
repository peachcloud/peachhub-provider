const KnexService = require('feathers-knex')
const auth = require('feathers-authentication')
const { restrictToOwner } = require('feathers-authentication-hooks')
const { disallow } = require('feathers-hooks-common')
const validateSchema = require('../../util/validateSchema')

const createSchema = require('../schemas/createBot')

module.exports = BotsService

function BotsService (server) {
  const sql = server.get('sql')

  const name = 'bots'
  const options = { Model: sql, name }

  server.use(name, KnexService(options))
  server.service(name).hooks(hooks)
}

const hooks = {
  before: {
    all: [auth.hooks.authenticate('jwt')],
    find: [restrictToOwner({ idField: 'id', ownerField: 'userId' })],
    create: [validateSchema(createSchema)],
    get: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },
  after: {}
}
