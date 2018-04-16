module.exports = {
  container: ({ theme }) => ({
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    ':after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.3,
      zIndex: -1,
      backgroundColor: theme.colors.canvas,
      backgroundImage: 'url("/background.svg")',
      backgroundRepeat: 'repeat'
    }
  }),
  header: ({ theme }) => ({
    display: 'flex',
    minHeight: theme.space[7],
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  }),
  title: ({ theme }) => ({
    fontSize: theme.fontSizes[5]
  }),
  startButton: ({ theme }) => ({
  })
}
