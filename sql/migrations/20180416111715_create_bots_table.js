exports.up = function (knex, Promise) {
  return knex.schema.createTable('pubs', function (table) {
    table.increments()
    table.string('name')
    table
      .integer('userId')
      .references('id')
      .inTable('users')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('pubs')
}
