
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments()
    table.string('name')
    table.string('email').unique()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
