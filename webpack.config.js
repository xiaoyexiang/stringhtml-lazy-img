const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

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
    plugins: [
        new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
    ],
}