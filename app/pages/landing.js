const h = require('react-hyperscript')
const { compose } = require('recompose')
const { connect: connectStyles } = require('react-fela')
const Typography = require('material-ui/Typography').default

const styles = require('../styles/landing')

module.exports = compose(
  connectStyles(styles)
)(Landing)

function Landing (props) {
  const {
    styles
  } = props

  return (
    h('div', {
      className: styles.container
    }, [
      h('header', {
        className: styles.header
      }, [
        h(Typography, {
          variant: 'display4',
          color: 'default',
          align: 'center'
        }, [
          'ButtCloud!'
        ]),
        h('img', {
          src: 'https://scontent.fakl1-1.fna.fbcdn.net/v/t39.2365-6/17639236_1785253958471956_282550797298827264_n.png?_nc_cat=0&oh=75f2de065fd5fc4261d8ed45eaf936de&oe=5B2833EA'
        })
      ])
    ])
  )
}
