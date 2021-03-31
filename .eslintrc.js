module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'google',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      arrowFunctions: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
        paths: ['./src'],
      },
    },
  },
  ignorePatterns: [
    '/lib/**/*',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'new-cap': ['error', { 'capIsNew': false }],
    'max-len': [2, {
      'code': 100,
    }],
    'object-curly-spacing': [2, 'always'],
    'indent': ['error', 2],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
