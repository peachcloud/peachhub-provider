const Mailer = require('nodemailer')

module.exports = function ({ config }) {
  const transporter = Mailer.createTransport(config.mailer)

  return {
    perform: function sendMail(data) {
      return transporter.sendMail(data)
    }
  }
}
