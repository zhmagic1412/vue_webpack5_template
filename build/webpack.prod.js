const { merge } = require('webpack-merge');
const common = require('./webpack.common')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const config = merge(common, {
    mode: 'production',
    plugins: [
        // 提取 CSS
        new MiniCssExtractPlugin({
            filename: "css/[hash].[name].css",
        }),
    ],
    optimization: {
        runtimeChunk: true,
        moduleIds: 'deterministic',
        minimizer: [
            //css压缩
            new CssMinimizerPlugin({
                parallel: 4,
            }),
            //js压缩
            new TerserPlugin(
                {
                    parallel: 4,
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    }
                }
            )
        ],
        splitChunks: {
            // include all types of chunks
            chunks: 'all',
            // 重复打包问题
            cacheGroups: {
                vendors: { // node_modules里的代码
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    // name: 'vendors', 一定不要定义固定的name
                    priority: 10, // 优先级
                    enforce: true
                }
            }
        }
    }

})


module.exports = config