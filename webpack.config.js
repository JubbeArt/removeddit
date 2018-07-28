const path = require('path')

module.exports = (env, argv) => ({
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/index.js'
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true
  },
  devtool: argv.mode !== 'production' ? 'cheap-module-eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
})
