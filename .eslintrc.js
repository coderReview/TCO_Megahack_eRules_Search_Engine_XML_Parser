module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    'lodash',
    'import',
  ],
  extends: [
    'eslint-config-nodejs-recommended/rules/best-practices',
    'eslint-config-nodejs-recommended/rules/errors',
    'eslint-config-nodejs-recommended/rules/jsdoc',
    'eslint-config-nodejs-recommended/rules/node',
    'eslint-config-nodejs-recommended/rules/style',
    'eslint-config-nodejs-recommended/rules/variables',
    'eslint-config-nodejs-recommended/rules/es6',
    'eslint-config-nodejs-recommended/rules/imports',
    'eslint-config-nodejs-recommended/rules/lodash',
  ].map(require.resolve),
  rules: {
    'babel/arrow-parens': 0,
    'import/no-commonjs': 0,
    "lodash/prefer-lodash-method": [2, {"ignoreObjects": ["Promise", "models.NaicsCode", "model"]}],
  }
};