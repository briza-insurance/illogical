import { spawnSync } from 'node:child_process'
import process from 'node:process'

const args = process.argv.slice(2)
const files = args.length > 0 ? args : ['src/__test__/fuzz/**/*.fuzz.test.ts']

const result = spawnSync('node', ['--import', 'tsx', '--test', ...files], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})

process.exit(result.status ?? 1)
