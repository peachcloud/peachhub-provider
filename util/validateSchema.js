const { validateSchema: ogValidateSchema } = require('feathers-hooks-common')
const { isNil } = require('ramda')
const Ajv = require('ajv')
const get = require('lodash.get')
const set = require('lodash.set')

const ajv = new Ajv({
  allErrors: true
})

module.exports = validateSchema

function validateSchema (schema) {
  return ogValidateSchema(schema, ajv, {
    addNewError
  })
}

function addNewError (sofar, ajvError, itemsLen, index) {
  if (sofar == null) sofar = {}
  const { dataPath, message } = ajvError
  const path = dataPath.startsWith('.') ? dataPath.substring(1) : dataPath
  const sofarMessageAtPath = get(sofar, path)
  const nextMessageAtPath = isNil(sofarMessageAtPath)
    ? message
    : sofarMessageAtPath + '\n' + message
  set(sofar, path, nextMessageAtPath)
  return sofar
}
