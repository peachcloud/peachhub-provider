exports.seed = function (knex, Promise) {
  return Promise.all([knex('pubs').del()]).then(() =>
    Promise.all([knex('users').del()])
  )
}
