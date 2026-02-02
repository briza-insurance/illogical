import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import resolve from '@rollup/plugin-node-resolve'

const libraryName = 'illogical'
const input = './src/index.ts'
const extensions = ['.js', '.ts']
const plugins = [
  resolve({ extensions }),
  commonjs(),
  eslint(),
  babel({
    extensions,
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
  }),
]

export default {
  input,
  output: [
    {
      file: './lib/' + libraryName + '.esm.js',
      format: 'esm',
    },
    { file: './lib/' + libraryName + '.cjs', format: 'cjs', exports: 'named' },
  ],
  plugins,
}
