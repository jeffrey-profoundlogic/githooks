module.exports = {
    "env": {
        "node": 1,
        "browser": 1
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "no-console": "error",
        "camelcase": "error",
    },
    "globals": {
          "pjs": true
    } 
}
