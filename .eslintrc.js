// https://eslint.org/docs/user-guide/configuring

module.exports = {
  'root': true,
  'parserOptions': {
    'parser': 'babel-eslint',
    'ecmaVersion': 6,
    'ecmaFeatures': {
      impliedStrict: true
    },
    'sourceType': 'module'
  },
  'env': {
    'browser': true,
    'node': true,
    'es6': true
  },
  'extends': [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // 'standard',
    "eslint:recommended"
  ],
  // add your custom rules here
  'rules': {
    // allow async-await
    'generator-star-spacing': 'off',
    'indent': [
      'error',
      2
    ],
    'linebreak-style': 'off',
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    "no-console": "off"
  }
}