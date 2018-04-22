
exports.up = function (knex, Promise) {
  return knex.schema.createTable('bots', function (table) {
    table.increments()
    table.string('name')
    table.string('userId')
      .references('email')
      .inTable('users')
    table.string('botId').unique()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('bots')
}
