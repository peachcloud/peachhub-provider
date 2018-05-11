const express = require('@feathersjs/express')
const favicon = require('serve-favicon')
const { join } = require('path')
const { path, pipe } = require('ramda')
const Compiler = require('bankai/http')

const Server = require('../util/server')

module.exports = AssetServer

const getAssetDirectory = path(['asset', 'directory'])
const getAssetReload = pipe(path(['asset', 'reload']), Boolean)

function AssetServer () {
  return Server('asset', { onCreate, onStart, onStop })

  function onCreate (server, config) {
    const log = server.get('logger')

    server.use(favicon(join(getAssetDirectory(config), 'favicon.ico')))

    server.use('/', express.static(getAssetDirectory(config)))

    const entry = join(__dirname, '../app')
    const compilerHandler = Compiler(entry, {
      reload: getAssetReload(config) // true in dev, false in test
    })
    const compiler = compilerHandler.compiler
    server.use(compilerHandler)
    compiler.on('error', (nodeName, edgeName, err) => {
      log.fatal(err)
    })
    server.set('compiler', compiler)
  }

  function onStart (server) {
    /*
    // (mw) attempt to have nightmare tests wait until after compiler is ready

    const compiler = server.get('compiler')

    return new Promise((resolve, reject) => {
      compiler.graph.on('change', handleChange)

      function handleChange (nodeName, edgeName) {
        if (nodeName === 'scripts' && edgeName === 'bundle') {
          console.log('bundle built!')
          compiler.graph.removeListener('change', handleChange)
          resolve()
        }
      }
    })
    */
  }

  function onStop (server) {
    const compiler = server.get('compiler')
    compiler.close()
  }
}
