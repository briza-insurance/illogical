module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'simple-import-sort',
    '@typescript-eslint'
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      typescript: {}
    }
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard'
  ],
  rules: {
    curly: 'error',
    'max-len': ['error', { code: 120 }],
    'no-dupe-class-members': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false }],
    'simple-import-sort/sort': ['error']
  }
}
