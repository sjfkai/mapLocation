const { injectBabelPlugin } = require('react-app-rewired');
const SentryPlugin = require('webpack-sentry-plugin');

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config);

  // sentry webpack plugin
  if (env === 'production') {
    config.plugins.push(new SentryPlugin({
      // Sentry options are required
      organization: 'sjfkai',
      project: 'map-location',
      apiKey: 'cb05229812dc493fbfc53c195bbfbccf3d0c04668ded40be921ee972c2d2ac4b',
      include: /.*js.*/,
      // Release version name/hash is required
      release: `${process.env.GIT_SHA}_${Date.now()}`
    }))
  }
  return config;
};