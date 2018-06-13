exports.up = function (knex, Promise) {
  return knex.schema.table('pubs', function (table) {
    table.string('slug')
    table.string('domain')
    table.unique(['slug', 'domain'])
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('pubs', function (table) {
    table.dropColumn('slug')
    table.dropColumn('domain')
    table.dropUnique(['slug', 'domain'])
  })
}
