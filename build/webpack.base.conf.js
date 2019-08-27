const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const productionConfig = require('./webpack.prod.conf.js') // 引入生产环境配置文件
const developmentConfig = require('./webpack.dev.conf.js') // 引入开发环境配置文件


/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
const generateConfig = env => {
  // 将需要的 Loader 和 Plugin 单独声明

  let scriptLoader = [
    {
      loader: 'babel-loader'
    }
  ]

  return {
    entry: {
        index: './src/index.js' // 需要打包的文件入口
    },
    output: {
        publicPath: env === 'development' ? '/' : './',
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'stringhtml-lazyload.js',
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /(node_modules)/, use: scriptLoader },
      ]
    },
    plugins: [
      new CleanWebpackPlugin()
    ]
  }
}

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig
  return merge(generateConfig(env), config) // 合并 公共配置 和 环境配置
}
