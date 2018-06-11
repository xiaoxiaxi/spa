module.exports = {
  mode: 'development',
  entry: {
    app: './app.js'
  },
  output: {
    path: __dirname + '/public/dist',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
    }]
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    inline: true,
    hot: true
  }
}