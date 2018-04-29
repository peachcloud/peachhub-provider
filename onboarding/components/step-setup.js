const h = require('react-hyperscript')
const { compose, lifecycle } = require('recompose')
const { partial } = require('ramda')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { Form, Field } = require('react-final-form')
const { TextField } = require('redux-form-material-ui')
const validate = require('redux-form-with-ajv').default
const Typography = require('material-ui/Typography').default
const Button = require('material-ui/Button').default

const schema = require('../../bots/schemas/createBot')
const styles = require('../styles/step-setup')

module.exports = compose(
  connectStyles(styles),
  partial(connectStore, [
    'doSubmitOnboardingSetup',
    'selectOnboardingUser',
    'selectOnboardingBot'
  ]),
)(OnboardingStepSetup)

function OnboardingStepSetup (props) {
  const {
    styles,
    onboardingUser: user,
    onboardingBot: bot
  } = props

  return (
    h('div', {
      className: styles.container
    }, [
      bot
        ? h(OnboardingStepSetupCompletion, props)
        : h(OnboardingStepSetupForm, props)
    ])
  )
}

function OnboardingStepSetupCompletion (props) {
  const {
    styles,
    onboardingBot: bot
  } = props

  return (
    h(Typography, {
      variant: 'body2',
      paragraph: true
    }, [
      'Bot ',
      bot.name,
      ' is being started. Click to continue',
      h(Button, {
        variant: 'raised',
        color: 'primary'
      }, [
        'Continue'
      ])
    ])
  )
}

function OnboardingStepSetupForm (props) {
  const {
    styles,
    handleSubmit,
    onboardingUser: user,
    doSubmitOnboardingSetup: doSubmit
  } = props

  return (
    h(Form, {
      onSubmit: doSubmit,
      initialValues: {
        userId: user.id,
        name: 'foo'
      },
      validate: validate(schema),
      render: ({ handleSubmit }) => (
        h('form', {
          className: styles.form,
          onSubmit: handleSubmit
        }, [
          h('div', {
            className: styles.fields
          }, [
            h(Field, {
              name: 'name',
              component: TextField,
              placeholder: 'Ash',
              helperText: 'What should we call your pub?',
              fullWidth: true,
              margin: 'normal'
            }),
            h(Field, {
              name: 'userId',
              component: 'input',
              type: 'hidden',
            }),
            h(Button, {
              className: styles.submitButton,
              variant: 'raised',
              color: 'primary',
              type: 'submit',
            }, [
              'Continue'
            ])
          ])
        ])
      )
    })
  )
}
