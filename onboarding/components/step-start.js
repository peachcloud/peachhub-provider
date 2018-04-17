const h = require('react-hyperscript')
const { compose, lifecycle } = require('recompose')
const { partial } = require('ramda')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { reduxForm: connectForm, Field } = require('redux-form')
const { TextField } = require('redux-form-material-ui')
const { required, email } = require('redux-form-validators')
const Typography = require('material-ui/Typography').default
const Button = require('material-ui/Button').default

const styles = require('../styles/step-start')

module.exports = compose(
  connectStyles(styles),
  partial(connectStore, [
    'doSubmitOnboardingStart',
    'doClearOnboardingUser',
    'doResendOnboardingEmail',
    'selectOnboardingUser'
  ]),
)(OnboardingStepStart)

function OnboardingStepStart (props) {
  const {
    styles,
    onboardingUser: user
  } = props

  return (
    h('div', {
      className: styles.container
    }, [
      user
        ? h(OnboardingStepStartCompletion, props)
        : h(OnboardingStepStartFormConnected, props)
    ])
  )
}

function OnboardingStepStartCompletion (props) {
  const {
    styles,
    onboardingUser: user,
    doClearOnboardingUser,
    doResendOnboardingEmail
  } = props

  const { id, name, email } = user

  return (
    h('div', {
      className: styles.completion
    }, [
      h(Typography, {
        variant: 'body2',
        paragraph: true
      }, [
        ' Hey ',
        name,
        '! ',
        h('i', { className: 'em-svg em-wave' })
      ]),
      h(Typography, {
        variant: 'body2',
        paragraph: true
      }, [
        'We sent a message ',
        h('i', { className: 'em-svg em-email' }),
        ' to you at ',
        email,
        ' with a link to continue onto ButtCloud.',
        h('i', { className: 'em-svg em-peach' }),
        h('i', { className: 'em-svg em-cloud' })
      ]),
      h(Typography, {
        variant: 'body1',
        paragraph: true
      }, [
        "Can't find the email? ",
        h('i', { className: 'em-svg em-anguished' }),
        h(Button, {
          variant: 'flat',
          color: 'default',
          size: 'small',
          onClick: handleResendEmail
        }, [
          'Resend Email'
        ]),
      ]),
      h(Typography, {
        variant: 'caption',
        paragraph: true
      }, [
        h(Button, {
          variant: 'flat',
          color: 'default',
          size: 'small',
          onClick: doClearOnboardingUser
        }, [
          'Start Over'
        ])
      ])
    ])
  )

  function handleResendEmail () {
    doResendOnboardingEmail(id)
  }
}

const OnboardingStepStartFormConnected = compose(
  connectForm({
    form: 'onboarding-start'
  })
)(OnboardingStepStartForm)

function OnboardingStepStartForm (props) {
  const {
    styles,
    handleSubmit,
    doSubmitOnboardingStart: doSubmit
  } = props

  return (
    h('form', {
      className: styles.form,
      onSubmit: handleSubmit(doSubmit)
    }, [
      h('div', {
        className: styles.fields
      }, [
        h(Field, {
          name: 'name',
          component: TextField,
          placeholder: 'Ash',
          label: 'Name',
          helperText: 'What should we call you?',
          fullWidth: true,
          margin: 'normal',
          validate: [
            required()
          ]
        }),
        h(Field, {
          name: 'email',
          component: TextField,
          placeholder: 'ash@example.com',
          label: 'Email',
          helperText: 'Where should we message you?',
          fullWidth: true,
          margin: 'normal',
          validate: [
            required(),
            email()
          ]
        }),
        h(Button, {
          className: styles.submitButton,
          variant: 'raised',
          color: 'primary',
          type: 'submit',
        }, [
          'Start'
        ])
      ])
    ])
  )
}
