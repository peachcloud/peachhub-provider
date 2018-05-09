const KnexService = require('feathers-knex')
const auth = require('feathers-authentication')
const {
  restrictToOwner,
  associateCurrentUser
} = require('feathers-authentication-hooks')
const { disallow } = require('feathers-hooks-common')
const validateSchema = require('../../util/validateSchema')

const createSchema = require('../schemas/createPub')

module.exports = pubsService

function pubsService (server) {
  const sql = server.get('sql')

  const name = 'pubs'
  const options = { Model: sql, name }

  server.use(name, KnexService(options))
  server.service(name).hooks(hooks)
}

const hooks = {
  before: {
    all: [auth.hooks.authenticate('jwt')],
    find: [restrictToOwner({ idField: 'id', ownerField: 'userId' })],
    create: [
      validateSchema(createSchema),
      associateCurrentUser({ idField: 'id', as: 'userId' })
    ],
    get: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },
  after: {}
}
