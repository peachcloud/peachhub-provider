module.exports = {
  container: () => ({
    flex: '0 1 auto'
  }),
  title: ({ theme }) => ({
    color: theme.colors.primary.contrastText,
    textDecoration: 'none'
  })
}
