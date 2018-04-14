const express = require('@feathersjs/express')
const favicon = require('serve-favicon')
const { join } = require('path')
const { get } = require('lodash')
const Compiler = require('bankai/http')

const Server = require('../util/server')

module.exports = AssetServer

function AssetServer () {
  return Server('asset', (server, config) => {
    server.use(favicon(join(get(config, 'asset.directory'), 'favicon.ico')))

    server.use('/', express.static(get(config, 'asset.directory')))

    const compilerHandler = Compiler(join(__dirname, '../app'))
    const compiler = compilerHandler.compiler
    server.use(compilerHandler)
    compiler.on('error', (nodeName, edgeName, err) => {
      server.log.fatal(err)
    })
  })
}
