const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio-client')
const authentication = require('@feathersjs/authentication-client')
const io = require('socket.io-client')

const config = require('../config')
window.config = config

const socket = io()

const client = feathers()
  .configure(socketio(socket))
  .configure(authentication({
    storage: window.localStorage
  }))
window.client = client
