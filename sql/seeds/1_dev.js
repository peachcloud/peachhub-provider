exports.seed = function (knex, Promise) {
  const devUser = {
    name: 'ButtCloud',
    email: 'buttcloudorg@gmail.com'
  }
  return knex('users').insert(devUser)
}
