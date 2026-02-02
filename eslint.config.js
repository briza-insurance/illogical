import { FlatCompat } from '@eslint/eslintrc'
import pkg from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'
import { URL } from 'url'
const { configs } = pkg

const __dirname = new URL('.', import.meta.url).pathname

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: configs.recommended,
  allConfig: configs.all,
})

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {},
    },

    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': typescriptEslint,
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },

      'import/resolver': {
        typescript: {},
      },
    },

    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    ),

    rules: {
      'prettier/prettier': 'error',
      curly: 'error',

      'max-len': [
        'error',
        {
          code: 120,
        },
      ],

      'no-dupe-class-members': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',

      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
        },
      ],

      'simple-import-sort/imports': ['error'],
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': true,
          'ts-ignore': false,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 3,
        },
      ],
    },
  },
  globalIgnores(['**/lib', 'types', 'eslint.config.js', 'rollup.config.mjs']),
])
