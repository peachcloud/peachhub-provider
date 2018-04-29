const KnexService = require('feathers-knex')
const auth = require('feathers-authentication')
const { merge } = require('ramda')
const { restrictToOwner } = require('feathers-authentication-hooks')
const { disallow, discard, iff, isProvider } = require('feathers-hooks-common')
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
//    all: [
//      auth.hooks.authenticate('jwt'),
//      restrictToOwner({
//        idField: 'id',
//        ownerField: 'userId'
//      })
//    ],
    find : [
      () => {}
    ],
    //TODO is this all I need to do to make a new entry to the db?
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
