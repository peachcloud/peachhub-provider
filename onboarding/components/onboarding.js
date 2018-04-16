const h = require('react-hyperscript')
const { compose } = require('recompose')
const { addIndex, map, partial } = require('ramda')
const { connect: connectStyles } = require('react-fela')
const { connect: connectStore } = require('redux-bundler-react')
const { default: Stepper, Step, StepLabel } = require('material-ui/Stepper')
const Typography = require('material-ui/Typography').default
const Button = require('material-ui/Button').default

const styles = require('../styles/onboarding')
const steps = require('../data/steps')

module.exports = compose(
  connectStyles(styles),
  partial(connectStore, [
    'selectOnboardingStepIndex',
    'selectOnboardingStep',
    'doUpdateUrl'
  ])
)(Onboarding)

function Onboarding (props) {
  const {
    styles,
    onboardingStepIndex,
    onboardingStep
  } = props

  return h('div', {
    className: styles.container
  }, [
    h(OnboardingStepper, {
      onboardingStepIndex
    }),

    onboardingStep != null && (
      h(onboardingStep.Component)
    )
  ])
}

function OnboardingStepper (props) {
  const {
    styles,
    onboardingStepIndex
  } = props

  return (
    h(Stepper, {
      activeStep: onboardingStepIndex
    }, [
      steps.map((step, index) => {
        const { label } = step
        return (
          h(Step, {
            key: index,
            completed: index < onboardingStepIndex
          }, [
            h(StepLabel, [
              label
            ])
          ])
        )
      })
    ])
  )
}

