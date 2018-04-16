module.exports = {
  // (mw) the container is a form, so it can't do flexbox
  form: () => ({}),
  container: ({ theme }) => ({
    margin: theme.space[3],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }),
  submitButton: ({ theme }) => ({
  }),
  completion: ({ theme }) => ({
    padding: theme.space[3],
    textAlign: 'center'
  })
}
