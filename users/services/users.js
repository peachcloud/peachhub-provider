const KnexService = require('feathers-knex')
const auth = require('@feathersjs/authentication')
const { merge } = require('ramda')
const { restrictToOwner } = require('feathers-authentication-hooks')
const { disallow, discard, iff, isProvider } = require('feathers-hooks-common')
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
    create: [
      validateSchema(createSchema),
    ],
    update: [
      iff(isProvider('external'),
        disallow()
      )
    ],
    patch: disallow(),
    remove: disallow(),
  },
  after: {
    all: [
      iff(isProvider('external'),
        discard('token')
      )
    ],
    create: [
      generateToken,
      sendOnboardingEmail
    ]
  }
}

async function generateToken (context) {
  const { app, result, service: usersService } = context
  const authService = app.service('authentication')

  const { id: userId } = result

  const authResult = await authService.create(
    {},
    {
      payload: { userId },
      transaction: context.params.transaction
    }
  )
  const { accessToken: token } = authResult

  const nextUser = merge(result, { token })
  await usersService.update(
    userId,
    nextUser,
// (mw) not sure why this fails but hey
//    { transaction: context.params.transaction }
  )
}

async function sendOnboardingEmail (context) {
  const onboardingEmailService = context.app.service('onboarding/email')
  const { result: { id: userId } } = context
  await onboardingEmailService.create({ userId })
}
