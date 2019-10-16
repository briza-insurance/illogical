import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'

const libraryName = 'illogical'
const input = './src/index.ts'
const extensions = ['.js', '.ts']
const plugins = [
  resolve({ extensions }),
  commonjs(),
  eslint(),
  babel({
    extensions,
    exclude: 'node_modules/**'
  })
]

export default
{
  input,
  output: [
    {
      file: './lib/' + libraryName + '.esm.js',
      format: 'esm'
    },
    {
      file: './lib/' + libraryName + '.js',
      format: 'cjs',
      exports: 'named'
    }
  ],
  plugins
}