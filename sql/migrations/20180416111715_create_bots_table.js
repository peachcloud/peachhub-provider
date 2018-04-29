
exports.up = function (knex, Promise) {
  return knex.schema.createTable('bots', function (table) {
    table.increments()
    table.string('name').unique()
    table.integer('userId')
      .references('id')
      .inTable('users')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('bots')
}
