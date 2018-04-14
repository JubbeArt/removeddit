const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'public')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true
  }
}
