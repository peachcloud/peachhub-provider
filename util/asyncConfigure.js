// copied from https://github.com/feathersjs/feathers/issues/509#issuecomment-358039365

module.exports = asyncConfigure

function asyncConfigure (server) {
  server.ready = Promise.resolve()

  server.asyncConfigure = function (fn) {
    server.ready = server.ready.then(() => {
      return fn.call(server, server)
    })

    return server.ready
  }
}
