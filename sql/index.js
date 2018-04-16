const Knex = require('knex')

module.exports = createSql

function createSql (config) {
  return Knex(config.sql)
}
