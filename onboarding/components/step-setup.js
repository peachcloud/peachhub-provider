const h = require('react-hyperscript')
const { compose } = require('recompose')
const { partial } = require('ramda')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { Form, Field } = require('react-final-form')
const { TextField } = require('redux-form-material-ui')
const validate = require('redux-form-with-ajv').default
const Button = require('material-ui/Button').default

const schema = require('../../pubs/schemas/createPub')
const styles = require('../styles/step-setup')

module.exports = compose(
  connectStyles(styles),
  partial(connectStore, [
    'doSubmitOnboardingSetup',
    'doFindPubs',
    'selectOnboardingUser',
    'selectOnboardingStepIndex'
  ])
)(OnboardingStepSetup)

function OnboardingStepSetup (props) {
  const { styles } = props

  return h(
    'div',
    {
      className: styles.container
    },
    [h(OnboardingStepSetupForm, props)]
  )
}

function OnboardingStepSetupForm (props) {
  const { styles, doSubmitOnboardingSetup: doSubmit } = props

  return h(Form, {
    onSubmit: doSubmit,
    validate: validate(schema),
    render: ({ handleSubmit }) =>
      h(
        'form',
        {
          className: styles.form,
          onSubmit: handleSubmit
        },
        [
          h(
            'div',
            {
              className: styles.fields
            },
            [
              h(Field, {
                name: 'name',
                component: TextField,
                placeholder: 'PubbyMcPubFace',
                helperText: 'What should we call your pub?',
                fullWidth: true,
                margin: 'normal'
              }),
              h(
                Button,
                {
                  className: styles.submitButton,
                  variant: 'raised',
                  color: 'primary',
                  type: 'submit'
                },
                ['Continue']
              )
            ]
          )
        ]
      )
  })
}
