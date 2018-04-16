const h = require('react-hyperscript')
const { compose, lifecycle } = require('recompose')
const { partial } = require('ramda')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { Step, StepButton } = require('material-ui/Stepper')
const Typography = require('material-ui/Typography').default
const Button = require('material-ui/Button').default

const styles = require('../styles/step-start')

module.exports = compose(
  connectStyles(styles),
  partial(connectStore, [
  ]),
)(OnboardingStepStart)

function OnboardingStepStart (props) {
  const {
    styles
  } = props

  return (
    h('div', [
      'start!'
    ])
  )
}
