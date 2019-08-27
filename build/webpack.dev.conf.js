const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map', // 调试源码
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 8000,
    hot: true,
    overlay: true,
    proxy: {
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: true
  },
  plugins: [
      new HtmlWebpackPlugin({
          title: 'StringHtml lazyImg',
          filename: 'index.html',
          template: 'index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
  ]
}
