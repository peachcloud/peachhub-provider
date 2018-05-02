const steps = [
  {
    label: 'start',
    Component: require('../components/step-start')
  },
  {
<<<<<<< HEAD
    label:  'setup',
    Component: require('../components/step-setup')
=======
    label: 'setup',
    Component: () => null
>>>>>>> 644f3782d5df49103f720d12053150d760a0efec
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
