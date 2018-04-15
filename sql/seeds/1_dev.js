exports.seed = function (knex, Promise) {
  const devUser = {
    name: 'alice'
  }
  return knex('users').insert(devUser)
}
