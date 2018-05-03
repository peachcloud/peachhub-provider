const steps = [
  {
    label: 'start',
    Component: require('../components/step-start')
  },
  {
    label: 'setup',
    Component: require('../components/step-setup')
  },
  {
    label: 'pay',
    Component: () => null
  },
  {
    label: 'enjoy',
    Component: () => null
  }
]

module.exports = steps
