/**
 * Bytecode serialize interpreter.
 *
 * Traverses compiled bytecode to reconstruct the original AST ExpressionInput.
 */

import { Input } from '../parser/index.js'
import { CompiledExpression } from './compiler.js'
import {
  OP_AND,
  OP_DIVIDE,
  OP_ENTER_SCOPE,
  OP_EQ,
  OP_GE,
  OP_GT,
  OP_IN,
  OP_IN_COLLECTION,
  OP_IN_CONST,
  OP_IN_SCAN_REFS_CONST,
  OP_JUMP_IF_FALSE,
  OP_JUMP_IF_TRUE,
  OP_LE,
  OP_LOAD_LOCAL,
  OP_LT,
  OP_MAKE_COLLECTION,
  OP_MULTIPLY,
  OP_NE,
  OP_NOR,
  OP_NOT,
  OP_NOT_IN,
  OP_NOT_IN_COLLECTION,
  OP_NOT_IN_CONST,
  OP_NOT_IN_SCAN_REFS_CONST,
  OP_OR,
  OP_OR_AND_IN_CONST_2,
  OP_OVERLAP,
  OP_OVERLAP_CONST,
  OP_OVERLAP_SCAN_REFS_CONST,
  OP_POP,
  OP_PREFIX,
  OP_PRESENT,
  OP_PUSH_CONST,
  OP_PUSH_REF_DYNAMIC,
  OP_PUSH_REF_KEY,
  OP_PUSH_REF_KEYS,
  OP_PUSH_REF_TOKENS,
  OP_PUSH_VALUE,
  OP_STORE_LOCAL,
  OP_SUBTRACT,
  OP_SUFFIX,
  OP_SUM,
  OP_UNDEFINED,
  OP_XOR,
} from './opcodes.js'
import { literalAt, numAt, requireMapEntry, slotSrc } from './simplifier.js'

// Per-compiled-expression Map caches
const overlapRefsResidualsCache = new WeakMap<
  CompiledExpression,
  Map<number, Input[]>
>()
const directionMapCache = new WeakMap<CompiledExpression, Map<number, 0 | 1>>()

// Pre-allocated stack and buffers
const MAX_STACK = 512
const stack: Input[] = new Array(MAX_STACK)
let stackTop = -1

const MAX_LOCALS = 64
const locals: Input[] = new Array(MAX_LOCALS)

const spillBuf: Input[] = new Array(MAX_STACK)
let spillTop = -1

const scopeStack: number[] = new Array(MAX_STACK)
let scopeStackTop = -1

/**
 * Serializes a compiled bytecode expression back into its ExpressionInput structure.
 */
export function serialize(compiled: CompiledExpression): Input {
  const { bytecode, opNames, refKeys } = compiled
  stackTop = -1
  spillTop = -1
  scopeStackTop = -1

  let overlapRefsResiduals = overlapRefsResidualsCache.get(compiled)
  if (overlapRefsResiduals === undefined) {
    overlapRefsResiduals = new Map(compiled.overlapRefsResiduals)
    overlapRefsResidualsCache.set(compiled, overlapRefsResiduals)
  }
  let directionMap = directionMapCache.get(compiled)
  if (directionMap === undefined) {
    directionMap = new Map(compiled.directionMap)
    directionMapCache.set(compiled, directionMap)
  }

  let i = 0
  const len = bytecode.length

  while (i < len) {
    const op = numAt(bytecode[i++])

    switch (op) {
      // ---------------------------------------------------------------------
      // Push
      // ---------------------------------------------------------------------
      case OP_PUSH_VALUE: {
        stack[++stackTop] = literalAt(bytecode[i++])
        break
      }

      case OP_PUSH_REF_KEY:
      case OP_PUSH_REF_KEYS:
      case OP_PUSH_REF_TOKENS:
      case OP_PUSH_REF_DYNAMIC: {
        const idx = numAt(bytecode[i++])
        stack[++stackTop] = refKeys[idx]
        break
      }

      case OP_MAKE_COLLECTION: {
        const n = numAt(bytecode[i++])
        const items: Input[] = new Array(n)
        for (let j = n - 1; j >= 0; j--) {
          items[j] = stack[stackTop--]
        }
        stack[++stackTop] = items
        break
      }

      case OP_PUSH_CONST: {
        stack[++stackTop] = compiled.consts[numAt(bytecode[i++])]
        break
      }

      case OP_OVERLAP_CONST: {
        const opcodePos = i - 1
        const constArr = compiled.consts[numAt(bytecode[i++])]
        const constOnLeft = directionMap.get(opcodePos) === 0
        const dynamic = stack[stackTop--]
        stack[++stackTop] = [
          opNames[OP_OVERLAP],
          constOnLeft ? constArr : dynamic,
          constOnLeft ? dynamic : constArr,
        ]
        break
      }

      case OP_OVERLAP_SCAN_REFS_CONST: {
        const opcodePos = i - 1
        const n = numAt(bytecode[i++])
        i += n // skip ref indices
        const constIdx = numAt(bytecode[i++])
        const constArr = compiled.consts[constIdx]
        const constOnLeft = directionMap.get(opcodePos) === 0
        const refInputs = requireMapEntry(overlapRefsResiduals, opcodePos)
        stack[++stackTop] = [
          opNames[OP_OVERLAP],
          constOnLeft ? constArr : refInputs,
          constOnLeft ? refInputs : constArr,
        ]
        break
      }

      case OP_IN_SCAN_REFS_CONST:
      case OP_NOT_IN_SCAN_REFS_CONST: {
        const opcodePos = i - 1
        const n = numAt(bytecode[i++])
        i += n
        const constIdx = numAt(bytecode[i++])
        const constArr = compiled.consts[constIdx]
        const constOnLeft = directionMap.get(opcodePos) === 1
        const refInputs = requireMapEntry(overlapRefsResiduals, opcodePos)
        const constInput = constArr[0]
        stack[++stackTop] = [
          opNames[op],
          constOnLeft ? constInput : refInputs,
          constOnLeft ? refInputs : constInput,
        ]
        break
      }

      case OP_STORE_LOCAL:
        locals[numAt(bytecode[i++])] = stack[stackTop]
        break

      case OP_LOAD_LOCAL:
        stack[++stackTop] = locals[numAt(bytecode[i++])]
        break

      // ---------------------------------------------------------------------
      // Binary Operators
      // ---------------------------------------------------------------------
      case OP_EQ:
      case OP_NE:
      case OP_GT:
      case OP_GE:
      case OP_LT:
      case OP_LE:
      case OP_PREFIX:
      case OP_SUFFIX:
      case OP_OVERLAP:
      case OP_IN:
      case OP_NOT_IN: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = [opNames[op], left, right]
        break
      }

      // ---------------------------------------------------------------------
      // Containment / Inline Collections
      // ---------------------------------------------------------------------
      case OP_IN_COLLECTION:
      case OP_NOT_IN_COLLECTION: {
        const opcodePos = i - 1
        const n = numAt(bytecode[i++])
        const collectionOnLeft = directionMap.get(opcodePos) === 0
        const scalar = stack[stackTop--]
        const items: Input[] = new Array(n)
        for (let j = 0; j < n; j++) {
          items[j] = stack[stackTop - (n - 1 - j)]
        }
        stackTop -= n
        stack[++stackTop] = collectionOnLeft
          ? [opNames[op], items, scalar]
          : [opNames[op], scalar, items]
        break
      }

      case OP_IN_CONST:
      case OP_NOT_IN_CONST: {
        const opcodePos = i - 1
        const constArr = compiled.consts[numAt(bytecode[i++])]
        const collectionOnLeft = directionMap.get(opcodePos) === 0
        const scalar = stack[stackTop--]
        stack[++stackTop] = collectionOnLeft
          ? [opNames[op], constArr, scalar]
          : [opNames[op], scalar, constArr]
        break
      }

      case OP_OR_AND_IN_CONST_2: {
        const ref1Idx = numAt(bytecode[i++])
        const ref2Idx = numAt(bytecode[i++])
        const n = numAt(bytecode[i++])
        const quadsStart = i
        i += n * 4

        const branches: Input[] = [opNames[OP_OR]]
        const andOp = opNames[OP_AND]
        const eqOp = opNames[OP_EQ]
        const inOp = opNames[OP_IN]
        const r1 = refKeys[ref1Idx]
        const r2 = refKeys[ref2Idx]

        for (let j = 0; j < n; j++) {
          const aVal = literalAt(bytecode[quadsStart + j * 4])
          const setB = compiled.consts[numAt(bytecode[quadsStart + j * 4 + 1])]
          const ref1OpByte = numAt(bytecode[quadsStart + j * 4 + 2])
          const ref2OpByte = numAt(bytecode[quadsStart + j * 4 + 3])
          const op1 = ref1OpByte === 1 ? inOp : eqOp
          const op2 = ref2OpByte === 1 ? inOp : eqOp
          const r1Val: Input = op1 === eqOp ? aVal : [aVal]
          let r2Val: Input = setB
          if (op2 === eqOp && Array.isArray(setB) && setB.length === 1) {
            r2Val = setB[0]
          }
          branches.push([andOp, [op1, r1, r1Val], [op2, r2, r2Val]])
        }

        stack[++stackTop] = branches
        break
      }

      // ---------------------------------------------------------------------
      // Presence
      // ---------------------------------------------------------------------
      case OP_PRESENT:
      case OP_UNDEFINED: {
        const val = stack[stackTop]
        stack[stackTop] = [opNames[op], val]
        break
      }

      // ---------------------------------------------------------------------
      // Arithmetic
      // ---------------------------------------------------------------------
      case OP_SUM:
      case OP_SUBTRACT:
      case OP_MULTIPLY:
      case OP_DIVIDE: {
        const n = numAt(bytecode[i++])
        const items: Input[] = new Array(n)
        for (let j = n - 1; j >= 0; j--) {
          items[j] = stack[stackTop--]
        }
        stack[++stackTop] = [opNames[op], ...items]
        break
      }

      // ---------------------------------------------------------------------
      // Logical
      // ---------------------------------------------------------------------
      case OP_NOT: {
        const val = stack[stackTop]
        if (Array.isArray(val) && val[0] === opNames[OP_NOR]) {
          // Already reconstructed by OP_NOR
          break
        }
        stack[stackTop] = [opNames[op], val]
        break
      }

      case OP_JUMP_IF_FALSE:
      case OP_JUMP_IF_TRUE:
        i++ // consume jump offset without jumping
        break

      case OP_ENTER_SCOPE:
        scopeStack[++scopeStackTop] = spillTop
        break

      case OP_POP:
        spillBuf[++spillTop] = stack[stackTop--]
        break

      case OP_AND:
      case OP_OR:
      case OP_NOR: {
        i++ // consume operand count byte
        const top = stack[stackTop--]
        if (top === opNames[op]) {
          return [opNames[op]]
        }
        const base = scopeStack[scopeStackTop--]
        const operands: Input[] = []
        for (let j = base + 1; j <= spillTop; j++) {
          operands.push(spillBuf[j])
        }
        spillTop = base
        operands.push(top)
        if (operands.length === 1) {
          return operands[0]
        }
        stack[++stackTop] = [opNames[op], ...operands]
        break
      }

      case OP_XOR: {
        const b = stack[stackTop--]
        const a = stack[stackTop--]
        const xorOp = opNames[OP_XOR]
        if (Array.isArray(a) && a[0] === xorOp) {
          stack[++stackTop] = [...a, b]
        } else {
          stack[++stackTop] = [xorOp, a, b]
        }
        break
      }

      /* node:coverage ignore next 2 */
      default:
        throw new Error(`unknown opcode: ${op}`)
    }
  }

  const top = stack[stackTop]

  return slotSrc(top)
}
