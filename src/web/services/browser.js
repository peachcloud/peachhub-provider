const Browser = require('next')
const express = require('express')
const { join } = require('path')

module.exports = BrowserService

async function BrowserService (server) {
  const conf = require('../../config/next')
  const dev = server.get('env') !== 'production'
  const dir = join(__dirname, '../../')
  const browser = Browser({ conf, dev, dir })
  const handle = browser.getRequestHandler()

  await browser.prepare()

  server.get('*', (req, res) => {
    return handle(req, res)
  })
}
