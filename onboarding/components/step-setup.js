const h = require('react-hyperscript')
const { compose } = require('recompose')
const { partial } = require('ramda')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { Form, Field } = require('react-final-form')
const { TextField, Select } = require('redux-form-material-ui')
const validate = require('redux-form-with-ajv').default
const Button = require('@material-ui/core/Button').default
const MenuItem = require('@material-ui/core/MenuItem').default
const FormControl = require('@material-ui/core/FormControl').default
const InputLabel = require('@material-ui/core/InputLabel').default

const pubDomains = require('../../pubs/data/domains')
const createPubSchema = require('../../pubs/schemas/createPub')
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
    validate: validate(createPubSchema),
    initialValues: {
      domain: pubDomains[0]
    },
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
                label: 'Name',
                helperText: 'What should we call your pub?',
                placeholder: 'Pubby McPubFace',
                fullWidth: true,
                margin: 'normal',
                required: true
              }),
              h(Field, {
                name: 'slug',
                component: TextField,
                label: 'Slug',
                helperText:
                  'What short name should we point to your pub (using only lowercase letters, digits, or dashes)?',
                placeholder: 'pubby-mcpubface',
                fullWidth: true,
                margin: 'normal',
                required: true
              }),
              h(
                FormControl,
                {
                  fullWidth: true,
                  margin: 'normal',
                  required: true
                },
                [
                  h(
                    InputLabel,
                    {
                      htmlFor: 'domain'
                    },
                    ['Domain']
                  ),
                  h(
                    Field,
                    {
                      name: 'domain',
                      component: Select
                    },
                    [
                      pubDomains.map(pubDomain =>
                        h(
                          MenuItem,
                          { key: pubDomain, value: pubDomain },
                          pubDomain
                        )
                      )
                    ]
                  )
                ]
              ),
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
