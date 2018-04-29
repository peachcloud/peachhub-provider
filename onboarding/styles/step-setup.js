module.exports = {
  container: ({ theme }) => ({
    padding: theme.space[3]
  }),
  // (mw) a form can't do flexbox
  form: () => ({}),
  fields: ({ theme }) => ({
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
