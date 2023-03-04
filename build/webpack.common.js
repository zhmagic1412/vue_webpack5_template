const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const paths = require('./paths');
const dotEnv = require("dotenv");
const webpack = require('webpack')

const ctx = {
    isEnvDevelopment: process.env.NODE_ENV === 'development',
    isEnvProduction: process.env.NODE_ENV === 'production',
}

const {
    isEnvDevelopment,
    isEnvProduction
} = ctx

// 按优先级由高到低的顺序加载.env文件
const pathsDotenv = paths.resolveApp(".env")
dotEnv.config({path: `${pathsDotenv}`})
dotEnv.config({
    path: isEnvDevelopment ? `${pathsDotenv}.dev`
        : `${pathsDotenv}.prod`
})

const envParams = {
    "process.env": Object.keys(process.env).reduce((env, key) => {
        env[key] = JSON.stringify(process.env[key]);
        return env;
    }, {}),
};

module.exports = {
    entry: {
        index: './src/index.ts',
    },
    output: {
        // 仅在生产环境添加 hash
        filename: ctx.isEnvProduction ? 'js/[name].[contenthash].bundle.js' : 'js/[name].bundle.js',
        path: paths.appDist,
        // 编译前清除目录
        clean: true,
        // publicPath: ctx.isEnvProduction ? 'https://xxx.com' : '', 关闭该 CDN 配置，因为示例项目，无 CDN 服务。

    },
    resolve: {
        alias: {
            '@': paths.appSrc, // @ 代表 src 路径
        },
        extensions: ['.ts', '.js'],
        modules: [
            'node_modules',
            paths.appSrc,
        ],
        symlinks: false,
    },
    plugins: [
        // 生成html，自动引入所有bundle
        new HtmlWebpackPlugin({
            title: 'demo',
            template: './public/index.html',
            filename: 'index.html',
        }),
        // 进度条
        new ProgressBarPlugin({
            format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
        }),
        // 自定义环境变量
        new webpack.DefinePlugin(envParams),
        // vue
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: paths.appSrc,
                type: 'asset/resource',
                generator:{
                    //与output.assetModuleFilename是相同的,这个写法引入的时候也会添加好这个路径
                    filename: 'images/[name][ext]',//'img/[name].[hash:6][ext]',
                    //打包后对资源的引入，文件命名已经有/img了
                    publicPath:'./'
                }
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/i,
                include: paths.appSrc,
                type: 'asset/resource',
            },
            {
                test: /\.(t|j)s$/,
                include: paths.appSrc,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            /*  {
                 test: /\.js$/,
                 include: paths.appSrc,
                 use: [{
                     loader: 'babel-loader',
                     options: {
                         presets: ['@babel/preset-env']
                     }
                 }]
             },
             {
                 test: /\.ts$/,
                 include: paths.appSrc,
                 use: [
                     {
                         loader: 'ts-loader',
                         options: {
                             appendTsSuffixTo: [/\.vue$/],// 对应文件添加个.ts或.tsx后缀
                             transpileOnly: true// 关闭类型检查，即只进行转译
                         }
                     }
                 ]
             }, */
            {
                test: /\.vue$/,
                include: paths.appSrc,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader']
            },
            {
                test: /\.(sa|sc)ss$/,
                include: paths.appSrc,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    //'style-loader',
                    isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader', // 仅生产环境
                    // 将 CSS 转化成 CommonJS 模块
                    {
                        loader: 'css-loader',
                        options: {
                            // Enable CSS Modules features
                            modules: false,
                            importLoaders: 2,
                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                        },
                    },
                    // 将 PostCSS 编译成 CSS
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        // postcss-preset-env 包含 autoprefixer
                                        'postcss-preset-env',
                                    ],
                                ],
                            },
                        },
                    },
                    // {
                    //   loader: 'thread-loader',
                    //   options: {
                    //     workerParallelJobs: 2
                    //   }
                    // },
                    // 将 Sass 编译成 CSS
                    'sass-loader',
                ].filter(Boolean),
            },
            {
                test: /\.less$/,
                include: [/[\\/]node_modules[\\/].*antd/],
                use: [
                    // 将 JS 字符串生成为 style 节点
                    //'style-loader',
                    isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader', // 仅生产环境
                    // 将 CSS 转化成 CommonJS 模块
                    {
                        loader: 'css-loader',
                        options: {
                            // Enable CSS Modules features
                            modules: false,
                            importLoaders: 2,
                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                        },
                    },
                    // 将 PostCSS 编译成 CSS
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        // postcss-preset-env 包含 autoprefixer
                                        'postcss-preset-env',
                                    ],
                                ],
                            },
                        },
                    },
                    // {
                    //   loader: 'thread-loader',
                    //   options: {
                    //     workerParallelJobs: 2
                    //   }
                    // },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                            /*      lessOptions:{
                                     javascriptEnabled: true
                                 }  */
                        }
                    }
                ].filter(Boolean),
            },
        ]

    },
    cache: {
        type: 'filesystem', // 使用文件缓存
    }

}