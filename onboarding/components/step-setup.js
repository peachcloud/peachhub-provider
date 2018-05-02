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
    'selectOnboardingStepIndex'
  ]),
)(OnboardingStepSetup)

function OnboardingStepSetup (props) {
  const {
    styles
  } = props

  return (
    h('div', {
      className: styles.container
    }, [
      h(OnboardingStepSetupForm, props)
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
        user: user.id,
        userId: user.id
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
            }), //TODO need 'about' field http://scuttlebot.io/docs/config/create-a-pub.html
            h(Field, {
              name: 'userId',
              component: 'input',
              type: 'hidden',
            }),
            h(Field, {
              name: 'user',
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
