module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "emptyRules": 0,
    "no-var": 0,
    "linebreak-style": 0,
    "indent": 0,
    "object-shorthand": 0,
    "consistent-return": 0,
    "prefer-const": 0,
    "no-param-reassign": 0,
    "no-else-return": 0,
    "no-eval": 0,
    "prefer-template": 0
  },
};
