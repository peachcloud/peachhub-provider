exports.up = function (knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('token')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('token')
  })
}
