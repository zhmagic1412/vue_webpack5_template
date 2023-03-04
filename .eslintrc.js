module.exports = {
    "env": {
        "browser": true,
/*        "es2021": true,*/
        "node": true,
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 13,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        'no-unused-vars': 0, // 禁止未使用过的变量
        '@typescript-eslint/no-explicit-any':0,
        "@typescript-eslint/no-var-requires": 0,
        "vue/html-indent":0,
        "vue/max-attributes-per-line":0
    }
};
