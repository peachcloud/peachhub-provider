const express = require('@feathersjs/express')
const favicon = require('serve-favicon')
const { join } = require('path')
const { path } = require('ramda')
const Compiler = require('bankai/http')

const Server = require('../util/server')

module.exports = AssetServer

const getAssetDirectory = path(['asset', 'directory'])

function AssetServer () {
  return Server('asset', (server, config) => {
    const log = server.get('logger')

    server.use(favicon(join(getAssetDirectory(config), 'favicon.ico')))

    server.use('/', express.static(getAssetDirectory(config)))

    const compilerHandler = Compiler(join(__dirname, '../app'))
    const compiler = compilerHandler.compiler
    server.use(compilerHandler)
    compiler.on('error', (nodeName, edgeName, err) => {
      log.fatal(err)
    })
  })
}
