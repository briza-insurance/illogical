import * as fs from 'fs'

import { compile, CompiledExpression } from '../bytecode/compiler.js'
import { disassemble } from '../bytecode/disassemble.js'
import { Parser } from '../parser/index.js'

/**
 * CLI tool to compile an illogical expression into bytecode.
 * Reads the expression from stdin and prints the compiled result as JSON.
 *
 * Usage: cat expression.json | npm run get-bytecode [-- --disassemble] | jq
 */
function main() {
  const args = process.argv.slice(2)
  const shouldDisassemble = args.includes('--disassemble')
  const parser = new Parser()

  try {
    const input = fs.readFileSync(0, 'utf-8')
    if (!input || input.trim() === '') {
      console.error('Error: No input provided on stdin.')
      process.exit(1)
    }
    const expression = JSON.parse(input)
    // Validate expression structure before compilation
    parser.parse(expression)
    const compiled = compile(expression, parser.options)

    const output: CompiledExpression & { disassembled?: string[] } = {
      ...compiled,
    }
    if (shouldDisassemble) {
      output.disassembled = disassemble(compiled)
    }

    process.stdout.write(JSON.stringify(output, null, 2) + '\n')
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
}

main()
