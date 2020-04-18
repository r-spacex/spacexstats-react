const path = require('path');

module.exports = {
  extends: ['plugin:react/recommended', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'react', 'jsx-a11y'],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
          },
        },
      },
    },
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8, // optional, recommended 6+
  },
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
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
    curly: ['error', 'multi-line'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
