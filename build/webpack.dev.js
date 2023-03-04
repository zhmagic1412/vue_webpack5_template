const { merge } = require('webpack-merge');
const common = require('./webpack.common')
const path = require('path')

const config = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        open: false,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true, // 热更新
        port: 8080
    },
    plugins:[],
    stats: "errors-only"


})

module.exports = config