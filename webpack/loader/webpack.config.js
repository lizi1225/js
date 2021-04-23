const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  resolveLoader: {
    modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'loaders')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      },
      // {
      //   test: /\.(png|jpg|gif|)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[hash:8].[ext]',
      //     esModule: false,
      //   }
      // },
      {
        test: /\.(png|jpg|gif|)$/,
        loader: 'url-loader',
        options: {
          name: '[hash:8].[ext]',
          // esModule: false,
          limit: 8 * 1024,
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}