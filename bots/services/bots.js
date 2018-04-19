const KnexService = require('feathers-knex')
const auth = require('feathers-authentication')
const { merge } = require('ramda')
const { restrictOwner } = require('feathers-authentication-hooks')
const { disallow, discard, iff, isProvider } = require('feathers-hooks-common')
const validateSchema = require('../../util/validateSchema')

const createSchema = require('../schema/createBot')

module.exports = BotsService

function BotsService (server) {
  const sql = server.get('sql')

  const name = 'bots'
  const options = { Model: sql, name }

  server.use(name, KnexService(options))
  server.use(name).hooks(hooks)
}

const hooks = {
  before: {
    all: [
      auth.hook.authenticate('jwt'),
      restrictToOwner({
        idField: 'id',
        ownerField: 'id'
      })
    ],
    find : [
      () => {}
    ],
    create: [
      validateSchema(createSchema)
    ],
    get: [
      disallow()
    ],
    update: [
      disallow()
    ],
    patch: [
      disallow()
    ],
    remove: [
      disallow()
    ]
  },
  after: {}
}
