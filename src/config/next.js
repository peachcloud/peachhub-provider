module.exports = {
  // pagesGlobPattern: 'src/**/pages/*.js',
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    // Perform customizations to webpack config
    
    config.module.rules.push(
      {
        test: require.resolve('./browser'),
        use: [
          {
            loader: 'val-loader'
          }
        ]
      }
    )

    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config

    return config
  }
}
