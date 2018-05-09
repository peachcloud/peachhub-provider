const { helper: Helper } = require('codeceptjs')
const Maildev = require('maildev')
const assert = require('assert')
const { isEqual, includes, isNil } = require('lodash')
const delay = require('delay')

class MailerHelper extends Helper {
  constructor (config) {
    super(config)

    this.maildev = Maildev({
      smtp: config.port,
      web: config.web
    })
    this.started = false
    this.emails = []
  }

  _init () {
    if (this.started) return
    this.started = true
    return new Promise((resolve, reject) => {
      this.maildev.listen(err => {
        if (err) reject(err)
        else resolve()
      })
      this.maildev.on('new', email => {
        this.emails.push(email)
      })
    })
  }

  _finishTest () {
    console.log('finish mailer')
    return new Promise((resolve, reject) => {
      this.maildev.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  async seeEmail (options, timeout = 10000) {
    const nextEmail = this.emails.pop()
    if (isNil(nextEmail)) {
      const waitTime = 100
      const nextTimeout = timeout - waitTime
      if (nextTimeout < 0) {
        throw new Error('New email never arrived')
      }
      await delay(waitTime)
      await this.seeEmail(options, timeout - waitTime)
      return
    }

    const { to, from, subject, text, html } = options
    if (to) {
      assert(
        isEqual(nextEmail.to, to),
        `Expected to ${JSON.stringify(
          to
        )} did not match next email to ${JSON.stringify(to)}`
      )
    }
    if (from) {
      assert(
        isEqual(nextEmail.from, from),
        `Expected from ${JSON.stringify(
          from
        )} did not match next email from ${JSON.stringify(from)}`
      )
    }
    if (subject) {
      assert(
        includes(nextEmail.subject, subject),
        `Expected subject ${subject} did not match next email subject ${subject}`
      )
    }
    if (text) {
      assert(
        includes(nextEmail.text, text),
        `Expected text ${text} did not match next email text ${text}`
      )
    }
    if (html) {
      assert(
        includes(nextEmail.html, html),
        `Expected html ${html} did not match next email html ${html}`
      )
    }
  }
}

module.exports = MailerHelper
