module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
        endOfLine: 'lf',
        tabWidth: 2,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
