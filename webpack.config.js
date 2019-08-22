const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js' // 需要打包的文件入口
    },
    output: {
        publicPath: __dirname + '/dist/', 
        path: path.resolve(__dirname, 'dist'),
        // filename: 'stringhtml-lazyload.[hash:8].js'
        filename: 'stringhtml-lazyload.js'
    },
    module: {
        rules: [{
            test: /\.js$/, // 使用正则来匹配 js 文件
            exclude: /node_modules/, // 排除依赖包文件夹
            use: {
                loader: 'babel-loader' // 使用 babel-loader
            }
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        historyApiFallback: {
            // HTML5 history模式
            rewrites: [{ from: /.*/, to: '/index.html' }]
        }
    },
    plugins: [
        // new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
        new HtmlWebpackPlugin({
            title: 'StringHtml lazyImg',
            filename: 'index.html',
            template: 'index.html',
        }),
        new webpack.HotModuleReplacementPlugin(), // 热部署模块
        new webpack.NamedModulesPlugin(),
    ]
}