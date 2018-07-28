const path = require('path')

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/index.js'
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}
