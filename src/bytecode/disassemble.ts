import * as fs from 'fs'

import { Result } from '../common/evaluable.js'
import { Parser } from '../parser/index.js'
import { compile, CompiledExpression } from './compiler.js'
import * as opcodes from './opcodes.js'

const opcodeNames = Object.fromEntries(
  Object.entries(opcodes).map(([name, value]) => [value, name])
)

/**
 * Disassembles bytecode into a human-readable format.
 */
function numAt(v: number | Result): number {
  if (typeof v !== 'number') {
    throw new Error(`expected number in bytecode, got ${typeof v}`)
  }
  return v
}

export function disassemble(compiled: CompiledExpression): string[] {
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
          const idx = numAt(bytecode[++i])
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
          const n = numAt(bytecode[++i])
          const refIndices = bytecode.slice(i + 1, i + 1 + n)
          i += n
          const constIdx = bytecode[++i]
          result.push(
            `${pc}: ${name} n=${n} refs=[${refIndices.join(', ')}] constIdx=${constIdx}`
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
