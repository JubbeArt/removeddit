const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/js/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'static'),
    historyApiFallback: true,
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    modules: [
      path.resolve('./src/js'),
      path.resolve('./node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      }
    ]
  }
}
