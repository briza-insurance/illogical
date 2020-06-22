module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    "no-dupe-class-members": "off",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "off"
  }
};