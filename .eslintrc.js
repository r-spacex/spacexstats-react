const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  plugins: ['import', 'prettier', 'react', '@typescript-eslint'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    alert: true,
    document: true,
    localStorage: true,
    navigator: true,
    window: true,
    HTMLElement: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    // TODO remove js
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/no-array-index-key': 2,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    'no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    complexity: ['error', 20], // TODO fix at 8
    'max-lines': ['error', 300],
    'max-depth': ['error', 4], // TODO fix at 3
    'max-params': ['error', 5],
    'arrow-body-style': ['error', 'as-needed'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 0,
    curly: ['error', 'multi-line'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
