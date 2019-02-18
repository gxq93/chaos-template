const path = require('path')

module.exports = {
  entry: ['./services/index.js'],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    library: 'RetailTradeMiddleLayer'
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }]
  }
}
