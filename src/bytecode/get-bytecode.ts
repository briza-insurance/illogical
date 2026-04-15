import * as fs from 'fs'

import { Parser } from '../parser/index.js'
import { compile, CompiledExpression } from './compiler.js'
import * as opcodes from './opcodes.js'

const opcodeNames = Object.fromEntries(
  Object.entries(opcodes).map(([name, value]) => [value, name])
)

/**
 * Disassembles bytecode into a human-readable format.
 */
function disassemble(compiled: CompiledExpression): string[] {
  const { bytecode, refs } = compiled
  const result: string[] = []
  let i = 0
  while (i < bytecode.length) {
    const pc = i
    const op = bytecode[i]
    const name = typeof op === 'number' ? opcodeNames[op] : undefined

    if (name) {
      switch (op) {
        case opcodes.OP_PUSH_VALUE:
          result.push(`${pc}: ${name} ${JSON.stringify(bytecode[++i])}`)
          break
        case opcodes.OP_PUSH_REF_KEY:
        case opcodes.OP_PUSH_REF_KEYS:
        case opcodes.OP_PUSH_REF_TOKENS:
        case opcodes.OP_PUSH_REF_DYNAMIC: {
          const idx = bytecode[++i] as number
          result.push(`${pc}: ${name} ${idx} (${JSON.stringify(refs[idx])})`)
          break
        }
        case opcodes.OP_PUSH_CONST:
        case opcodes.OP_LOAD_LOCAL:
        case opcodes.OP_STORE_LOCAL:
        case opcodes.OP_JUMP_IF_FALSE:
        case opcodes.OP_JUMP_IF_TRUE:
        case opcodes.OP_MAKE_COLLECTION:
        case opcodes.OP_IN_COLLECTION:
        case opcodes.OP_NOT_IN_COLLECTION:
        case opcodes.OP_IN_CONST:
        case opcodes.OP_NOT_IN_CONST:
        case opcodes.OP_OVERLAP_CONST:
        case opcodes.OP_SUM:
        case opcodes.OP_SUBTRACT:
        case opcodes.OP_MULTIPLY:
        case opcodes.OP_DIVIDE:
          result.push(`${pc}: ${name} ${bytecode[++i]}`)
          break
        case opcodes.OP_OVERLAP_SCAN_REFS_CONST: {
          const n = bytecode[++i] as number
          const refIndices = bytecode.slice(i + 1, i + 1 + n)
          i += n
          const constIdx = bytecode[++i]
          result.push(
            `${pc}: ${name} n=${n} refs=[${refIndices.join(', ')}] constIdx=${constIdx}`
          )
          break
        }
        case opcodes.OP_OR_AND_IN_CONST_2: {
          const ref1Idx = bytecode[++i] as number
          const ref2Idx = bytecode[++i] as number
          const m = bytecode[++i] as number
          const entriesStart = i + 1
          i += m * 2
          const entries: string[] = []
          for (let j = 0; j < m; j++) {
            const aVal = bytecode[entriesStart + j * 2]
            const setBIdx = bytecode[entriesStart + j * 2 + 1]
            entries.push(`(${JSON.stringify(aVal)}->${setBIdx})`)
          }
          result.push(
            `${pc}: ${name} ref1=${ref1Idx} ref2=${ref2Idx} m=${m} entries=[${entries.join(' ')}]`
          )
          break
        }
        default:
          result.push(`${pc}: ${name}`)
      }
    } else {
      result.push(`${pc}: ??? ${op}`)
    }
    i++
  }
  return result
}

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
