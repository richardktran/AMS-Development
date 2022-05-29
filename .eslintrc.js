/* eslint-disable prettier/prettier */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'standard', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        trailingComma: 'es5',
        semi: false,
        singleQuote: true,
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        'endOfLine': 'auto',
      },
    ],
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      
    ],
    'prefer-promise-reject-errors': 'warn',
    'react/prop-types': 'off',
    'linebreak-style': 'off',
    'camelcase': 'off',
    'react/display-name': 'off',
    'no-case-declarations': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
