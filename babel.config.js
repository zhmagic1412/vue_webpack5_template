module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage', // 按需引入 polyfill
                corejs: 3
            },
        ],
        [
            "@babel/preset-typescript",
            {
                isTSX: true,
                allowNamespaces: true,
                allExtensions: true, //支持所有文件扩展名
            }
        ],
    ],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: 3,
            }
        ],
        ["@vue/babel-plugin-jsx"],
        [
            "import",
            {
                "libraryName": "ant-design-vue",
                "libraryDirectory": "es",
                "style": "css"
            }
        ]
    ]
};
