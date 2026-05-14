import { CompiledExpression } from '../bytecode/compiler.js'
import * as opcodes from '../bytecode/opcodes.js'
import { Result } from '../common/evaluable.js'
import { DisassembledInstruction } from './types.js'

const opcodeNames: Record<number, string> = Object.fromEntries(
  Object.entries(opcodes).map(([name, value]) => [value, name])
)

export function disassemble(
  compiled: CompiledExpression
): DisassembledInstruction[] {
  const { bytecode, refs } = compiled
  const result: DisassembledInstruction[] = []
  function numAt(v: number | Result): number {
    if (typeof v !== 'number') {
      throw new Error(`expected number in bytecode, got ${typeof v}`)
    }
    return v
  }

  let i = 0
  let index = 0

  while (i < bytecode.length) {
    const pcStart = i
    const op = numAt(bytecode[i])
    const name = opcodeNames[op] ?? `???`
    let text: string

    switch (op) {
      case opcodes.OP_PUSH_VALUE:
        text = `${pcStart}: ${name} ${JSON.stringify(bytecode[++i])}`
        break

      case opcodes.OP_PUSH_REF_KEY:
      case opcodes.OP_PUSH_REF_KEYS:
      case opcodes.OP_PUSH_REF_TOKENS:
      case opcodes.OP_PUSH_REF_DYNAMIC: {
        const idx = numAt(bytecode[++i])
        text = `${pcStart}: ${name} ${idx} (${JSON.stringify(refs[idx])})`
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
        text = `${pcStart}: ${name} ${bytecode[++i]}`
        break

      case opcodes.OP_OVERLAP_SCAN_REFS_CONST: {
        const n = numAt(bytecode[++i])
        const refIndices = bytecode.slice(i + 1, i + 1 + n)
        i += n
        const constIdx = bytecode[++i]
        text = `${pcStart}: ${name} n=${n} refs=[${refIndices.join(', ')}] constIdx=${constIdx}`
        break
      }

      case opcodes.OP_OR_AND_IN_CONST_2: {
        const ref1Idx = numAt(bytecode[++i])
        const ref2Idx = numAt(bytecode[++i])
        const m = numAt(bytecode[++i])
        const entriesStart = i + 1
        i += m * 2
        const entries: string[] = []
        for (let j = 0; j < m; j++) {
          const aVal = bytecode[entriesStart + j * 2]
          const setBIdx = bytecode[entriesStart + j * 2 + 1]
          entries.push(`(${JSON.stringify(aVal)}->${setBIdx})`)
        }
        text = `${pcStart}: ${name} ref1=${ref1Idx} ref2=${ref2Idx} m=${m} entries=[${entries.join(' ')}]`
        break
      }

      default:
        text = `${pcStart}: ${name}`
    }

    result.push({ index, pcStart, pcEnd: i, text })
    index++
    i++
  }

  return result
}
