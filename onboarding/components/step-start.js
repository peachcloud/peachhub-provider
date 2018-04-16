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
    'selectOnboardingStartForm'
  ]),
  connectForm({
    form: 'onboarding-start'
  })
)(OnboardingStepStart)

function OnboardingStepStart (props) {
  const {
    styles,
    handleSubmit,
    onboardingStartForm: values
  } = props

  console.log('values', values)

  return (
    h('form', {
      className: styles.form,
      onSubmit: handleSubmit
    }, [
      h('div', {
        className: styles.container
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
