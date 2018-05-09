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
    return new Promise((resolve, reject) => {
      this.maildev.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  _before () {
    this.emails = []
  }

  async waitForEmail (index, timeout = 10000) {
    const email = this.emails[index]

    if (isNil(email)) {
      const waitTime = 100
      const nextTimeout = timeout - waitTime
      if (nextTimeout < 0) {
        throw new Error('New email never arrived')
      }
      await delay(waitTime)
      await this.waitForEmail(index, timeout - waitTime)
    }
  }

  async seeEmail (index, options) {
    const email = this.emails[index]
    const { to, from, subject, text, html } = options

    if (to) {
      assert(
        isEqual(email.to, to),
        `Expected to ${JSON.stringify(
          to
        )} did not match next email to ${JSON.stringify(email.to)}`
      )
    }
    if (from) {
      assert(
        isEqual(email.from, from),
        `Expected from ${JSON.stringify(
          from
        )} did not match next email from ${JSON.stringify(email.from)}`
      )
    }
    if (subject) {
      assert(
        includes(email.subject, subject),
        `Expected subject ${subject} did not match next email subject ${
          email.subject
        }`
      )
    }
    if (text) {
      assert(
        includes(email.text, text),
        `Expected text ${text} did not match next email text ${email.text}`
      )
    }
    if (html) {
      assert(
        includes(email.html, html),
        `Expected html ${html} did not match next email html ${email.html}`
      )
    }
  }

  async grabTextFromEmail (index, matcher) {
    return this.emails[index].text.match(matcher)
  }
}

module.exports = MailerHelper
