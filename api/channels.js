module.exports = Channels

function Channels (server) {
  server.configure(function (server) {
    server.on('connection', connection => {
      server.channel('anonymous').join(connection)
    })
    server.publish((data, hook) => {
      return server.channel('anonymous')
    })
  })
}
