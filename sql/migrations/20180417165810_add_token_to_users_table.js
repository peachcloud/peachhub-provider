exports.up = function (knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.text('token')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('token')
  })
}
