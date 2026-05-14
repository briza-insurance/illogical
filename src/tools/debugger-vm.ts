/**
 * Instrumented VM for the bytecode debugger.
 *
 * THIS FILE IS A DELIBERATE COPY of src/bytecode/interpreter.ts with snapshot
 * capture added around each opcode. It MUST be kept in sync with the production
 * interpreter. A CI test (src/bytecode/debug-sync.test.ts) asserts that both
 * files handle the same set of opcodes — if you add a new opcode to interpreter.ts,
 * the test will fail until you add it here too.
 */

import { CompiledExpression } from '../bytecode/compiler.js'
import {
  OP_AND,
  OP_DIVIDE,
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
} from '../bytecode/opcodes.js'
import * as opcodes from '../bytecode/opcodes.js'
import {
  asFullRef,
  asKeyRef,
  asKeysRef,
  resolveCompactRef,
  resolveDynamic,
  resolveKeys,
  resolveTokens,
} from '../bytecode/refs.js'
import { Context, Result } from '../common/evaluable.js'
import { isNumber, isString } from '../common/type-check.js'
import { toDateNumber } from '../common/util.js'
import { operateWithExpectedDecimals } from '../expression/arithmetic/operateWithExpectedDecimals.js'
import { disassemble } from './debugger-disasm.js'
import { DebugTrace, StepSnapshot } from './types.js'

const opcodeNames: Record<number, string> = Object.fromEntries(
  Object.entries(opcodes).map(([name, value]) => [value, name])
)

function numAt(v: number | Result): number {
  if (typeof v !== 'number') {
    throw new Error(
      `bytecode integrity error: expected number, got ${typeof v}`
    )
  }
  return v
}

const addDecimals = operateWithExpectedDecimals('sum')
const subtractDecimals = operateWithExpectedDecimals('subtract')
const multiplyDecimals = operateWithExpectedDecimals('multiply')
const divideDecimals = (a: number, b: number): number => a / b

function relationalCompare(
  left: Result,
  right: Result,
  op: typeof OP_GT | typeof OP_GE | typeof OP_LT | typeof OP_LE
): boolean {
  if (isNumber(left) && isNumber(right)) {
    if (op === OP_GT) {
      return left > right
    }
    if (op === OP_GE) {
      return left >= right
    }
    if (op === OP_LT) {
      return left < right
    }
    return left <= right
  }
  const ld = toDateNumber(left)
  const rd = toDateNumber(right)
  if (!isNaN(ld) && !isNaN(rd)) {
    if (op === OP_GT) {
      return ld > rd
    }
    if (op === OP_GE) {
      return ld >= rd
    }
    if (op === OP_LT) {
      return ld < rd
    }
    return ld <= rd
  }
  return false
}

function arithmeticReduce(
  values: number[],
  op: typeof OP_SUM | typeof OP_SUBTRACT | typeof OP_MULTIPLY | typeof OP_DIVIDE
): Result {
  if (op === OP_SUM) {
    return values.reduce(addDecimals)
  }
  if (op === OP_SUBTRACT) {
    return values.reduce(subtractDecimals)
  }
  if (op === OP_MULTIPLY) {
    return values.reduce(multiplyDecimals)
  }
  return values.reduce(divideDecimals)
}

const constSetsCache = new WeakMap<
  CompiledExpression,
  (Set<Result> | undefined)[]
>()
const invertedIndexCache = new WeakMap<
  CompiledExpression,
  Map<number, Map<Result, number[]>>
>()

export function interpretDebug(
  compiled: CompiledExpression,
  ctx: Context,
  expression: unknown
): DebugTrace {
  const { bytecode, refs, consts } = compiled
  let constSets = constSetsCache.get(compiled)
  if (constSets === undefined) {
    constSets = new Array(consts.length)
    constSetsCache.set(compiled, constSets)
  }
  let invertedIndexes = invertedIndexCache.get(compiled)
  if (invertedIndexes === undefined) {
    invertedIndexes = new Map()
    invertedIndexCache.set(compiled, invertedIndexes)
  }
  const len = bytecode.length

  // Own stack and locals — not shared with the production interpreter
  const stack: Result[] = new Array(512)
  let stackTop = -1
  const locals: Result[] = new Array(64)

  const disassembly = disassemble(compiled)
  // Build a map from pcStart → disassembly line text for snapshot annotation
  const disasmByPc = new Map<number, string>()
  for (const instr of disassembly) {
    disasmByPc.set(instr.pcStart, instr.text)
  }

  const snapshots: StepSnapshot[] = []

  let i = 0
  while (i < len) {
    const pc = i
    const op = numAt(bytecode[i])
    const opName = opcodeNames[op] ?? `???`
    const stackBefore = stack.slice(0, stackTop + 1)
    const localsBefore = locals
      .slice(0, 64)
      .filter((_, idx) => locals[idx] !== undefined)

    switch (op) {
      // -----------------------------------------------------------------------
      // Operands
      // -----------------------------------------------------------------------
      case OP_PUSH_VALUE:
        stack[++stackTop] = bytecode[++i]
        break

      case OP_PUSH_REF_KEY:
        stack[++stackTop] = ctx[asKeyRef(refs[numAt(bytecode[++i])])]
        break

      case OP_PUSH_REF_KEYS:
        stack[++stackTop] = resolveKeys(
          asKeysRef(refs[numAt(bytecode[++i])]),
          ctx
        )
        break

      case OP_PUSH_REF_TOKENS: {
        const ref = asFullRef(refs[numAt(bytecode[++i])])
        stack[++stackTop] = resolveTokens(ref.tokens ?? [], ref.t, ctx)
        break
      }

      case OP_PUSH_REF_DYNAMIC: {
        const ref = asFullRef(refs[numAt(bytecode[++i])])
        stack[++stackTop] = resolveDynamic(ref.k!, ref.t, ctx)
        break
      }

      case OP_MAKE_COLLECTION: {
        const n = numAt(bytecode[++i])
        const arr: Result[] = new Array(n)
        for (let j = n - 1; j >= 0; j--) {
          arr[j] = stack[stackTop--]
        }
        stack[++stackTop] = arr
        break
      }

      case OP_PUSH_CONST:
        stack[++stackTop] = consts[numAt(bytecode[++i])]
        break

      case OP_OVERLAP_CONST: {
        const constIdx = numAt(bytecode[++i])
        const constArr = consts[constIdx]
        const dynamic = stack[stackTop--]
        if (!Array.isArray(dynamic)) {
          stack[++stackTop] = false
          break
        }
        const dLen = dynamic.length
        const cLen = constArr.length
        if (cLen === 0 && dLen === 0) {
          stack[++stackTop] = true
          break
        }
        let found = false
        if (cLen === 1) {
          const target = constArr[0]
          for (let j = 0; j < dLen; j++) {
            if (dynamic[j] === target) {
              found = true
              break
            }
          }
        } else {
          let s = constSets[constIdx]
          if (s === undefined) {
            s = new Set<Result>(constArr)
            constSets[constIdx] = s
          }
          for (let j = 0; j < dLen; j++) {
            if (s.has(dynamic[j])) {
              found = true
              break
            }
          }
        }
        stack[++stackTop] = found
        break
      }

      case OP_STORE_LOCAL:
        locals[numAt(bytecode[++i])] = stack[stackTop]
        break

      case OP_LOAD_LOCAL:
        stack[++stackTop] = locals[numAt(bytecode[++i])]
        break

      // -----------------------------------------------------------------------
      // Equality
      // -----------------------------------------------------------------------
      case OP_EQ: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = left === right
        break
      }

      case OP_NE: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = left !== right
        break
      }

      // -----------------------------------------------------------------------
      // Relational
      // -----------------------------------------------------------------------
      case OP_GT:
      case OP_GE:
      case OP_LT:
      case OP_LE: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = relationalCompare(left, right, op)
        break
      }

      // -----------------------------------------------------------------------
      // Containment
      // -----------------------------------------------------------------------
      case OP_IN: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (
          left === null ||
          left === undefined ||
          right === null ||
          right === undefined
        ) {
          stack[++stackTop] = false
          break
        }
        if (Array.isArray(left) && Array.isArray(right)) {
          throw new Error('IN: both operands are arrays')
        }
        if (!Array.isArray(left) && !Array.isArray(right)) {
          throw new Error('IN: neither operand is an array')
        }
        if (Array.isArray(left)) {
          stack[++stackTop] = left.indexOf(right) > -1
        } else if (Array.isArray(right)) {
          stack[++stackTop] = right.indexOf(left) > -1
        }
        break
      }

      case OP_NOT_IN: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (
          left === null ||
          left === undefined ||
          right === null ||
          right === undefined
        ) {
          stack[++stackTop] = true
          break
        }
        if (Array.isArray(left) && Array.isArray(right)) {
          throw new Error('NOT IN: both operands are arrays')
        }
        if (!Array.isArray(left) && !Array.isArray(right)) {
          throw new Error('NOT IN: neither operand is an array')
        }
        if (Array.isArray(left)) {
          stack[++stackTop] = left.indexOf(right) === -1
        } else if (Array.isArray(right)) {
          stack[++stackTop] = right.indexOf(left) === -1
        }
        break
      }

      case OP_IN_COLLECTION: {
        const n = numAt(bytecode[++i])
        const scalar = stack[stackTop--]
        let found = false
        if (scalar !== null && scalar !== undefined) {
          for (let j = 0; j < n; j++) {
            if (stack[stackTop - j] === scalar) {
              found = true
              break
            }
          }
        }
        stackTop -= n
        stack[++stackTop] = found
        break
      }

      case OP_NOT_IN_COLLECTION: {
        const n = numAt(bytecode[++i])
        const scalar = stack[stackTop--]
        let found = false
        if (scalar !== null && scalar !== undefined) {
          for (let j = 0; j < n; j++) {
            if (stack[stackTop - j] === scalar) {
              found = true
              break
            }
          }
        }
        stackTop -= n
        stack[++stackTop] = !found
        break
      }

      case OP_IN_CONST: {
        const constIdx = numAt(bytecode[++i])
        const scalar = stack[stackTop--]
        if (scalar === null || scalar === undefined) {
          stack[++stackTop] = false
          break
        }
        let s = constSets[constIdx]
        if (s === undefined) {
          s = new Set<Result>(consts[constIdx])
          constSets[constIdx] = s
        }
        stack[++stackTop] = s.has(scalar)
        break
      }

      case OP_NOT_IN_CONST: {
        const constIdx = numAt(bytecode[++i])
        const scalar = stack[stackTop--]
        if (scalar === null || scalar === undefined) {
          stack[++stackTop] = true
          break
        }
        let s = constSets[constIdx]
        if (s === undefined) {
          s = new Set<Result>(consts[constIdx])
          constSets[constIdx] = s
        }
        stack[++stackTop] = !s.has(scalar)
        break
      }

      case OP_OVERLAP_SCAN_REFS_CONST: {
        const n = numAt(bytecode[++i])
        const refStart = i + 1
        i += n
        const constIdx = numAt(bytecode[++i])
        const constArr = consts[constIdx]
        const cLen = constArr.length
        let found = false
        if (cLen === 0) {
          found = false
        } else if (cLen === 1) {
          const target = constArr[0]
          for (let j = 0; j < n; j++) {
            const v = resolveCompactRef(
              refs[numAt(bytecode[refStart + j])],
              ctx
            )
            if (v === target) {
              found = true
              break
            }
          }
        } else {
          let s = constSets[constIdx]
          if (s === undefined) {
            s = new Set<Result>(constArr)
            constSets[constIdx] = s
          }
          const hasUndefined = s.has(undefined)
          const hasNull = s.has(null)
          for (let j = 0; j < n; j++) {
            const v = resolveCompactRef(
              refs[numAt(bytecode[refStart + j])],
              ctx
            )
            if (v === undefined) {
              if (hasUndefined) {
                found = true
                break
              }
              continue
            }
            if (v === null) {
              if (hasNull) {
                found = true
                break
              }
              continue
            }
            if (s.has(v)) {
              found = true
              break
            }
          }
        }
        stack[++stackTop] = found
        break
      }

      case OP_IN_SCAN_REFS_CONST:
      case OP_NOT_IN_SCAN_REFS_CONST: {
        // bytecode layout: N, ref0..refN-1, constIdx (const is [scalar])
        const n = numAt(bytecode[++i])
        const refStart = i + 1
        i += n
        const constIdx = numAt(bytecode[++i])
        const target = consts[constIdx][0]
        let found = false
        if (target !== null && target !== undefined) {
          for (let j = 0; j < n; j++) {
            const v = resolveCompactRef(
              refs[numAt(bytecode[refStart + j])],
              ctx
            )
            if (v === target) {
              found = true
              break
            }
          }
        }
        stack[++stackTop] = op === OP_IN_SCAN_REFS_CONST ? found : !found
        break
      }

      case OP_OR_AND_IN_CONST_2: {
        // bytecode layout: ref1Idx, ref2Idx, M, v0, setBIdx0, v1, setBIdx1, ..., vM-1, setBIdxM-1
        const ref1Idx = numAt(bytecode[++i])
        const ref2Idx = numAt(bytecode[++i])
        const m = numAt(bytecode[++i])
        const entriesStart = i + 1
        i += m * 2

        let idxMap = invertedIndexes!.get(entriesStart)
        if (idxMap === undefined) {
          idxMap = new Map<Result, number[]>()
          for (let j = 0; j < m; j++) {
            const aVal = bytecode[entriesStart + j * 2]
            const setBIdx = numAt(bytecode[entriesStart + j * 2 + 1])
            let list = idxMap.get(aVal)
            if (list === undefined) {
              list = []
              idxMap.set(aVal, list)
            }
            list.push(setBIdx)
          }
          invertedIndexes!.set(entriesStart, idxMap)
        }

        const v1 = resolveCompactRef(refs[ref1Idx], ctx)
        const v2 = resolveCompactRef(refs[ref2Idx], ctx)

        let found = false
        if (
          v1 !== undefined &&
          v1 !== null &&
          v2 !== undefined &&
          v2 !== null
        ) {
          const setBIndices = idxMap.get(v1)
          if (setBIndices !== undefined) {
            for (let j = 0; j < setBIndices.length; j++) {
              const setBIdx = setBIndices[j]
              let s2 = constSets![setBIdx]
              if (s2 === undefined) {
                s2 = new Set<Result>(consts[setBIdx])
                constSets![setBIdx] = s2
              }
              if (s2.has(v2)) {
                found = true
                break
              }
            }
          }
        }
        stack[++stackTop] = found
        break
      }

      // -----------------------------------------------------------------------
      // String
      // -----------------------------------------------------------------------
      case OP_PREFIX: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] =
          isString(left) && isString(right) ? right.startsWith(left) : false
        break
      }

      case OP_SUFFIX: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] =
          isString(left) && isString(right) ? left.endsWith(right) : false
        break
      }

      // -----------------------------------------------------------------------
      // Array
      // -----------------------------------------------------------------------
      case OP_OVERLAP: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (
          left === null ||
          left === undefined ||
          right === null ||
          right === undefined
        ) {
          stack[++stackTop] = false
          break
        }
        if (!Array.isArray(left) || !Array.isArray(right)) {
          throw new Error('OVERLAP: both operands must be arrays')
        }
        if (left.length === 0 && right.length === 0) {
          stack[++stackTop] = true
          break
        }
        stack[++stackTop] = left.some((el) => right.includes(el))
        break
      }

      // -----------------------------------------------------------------------
      // Presence
      // -----------------------------------------------------------------------
      case OP_PRESENT:
        stack[stackTop] =
          stack[stackTop] !== undefined && stack[stackTop] !== null
        break

      case OP_UNDEFINED:
        stack[stackTop] = stack[stackTop] === undefined
        break

      // -----------------------------------------------------------------------
      // Arithmetic
      // -----------------------------------------------------------------------
      case OP_SUM:
      case OP_SUBTRACT:
      case OP_MULTIPLY:
      case OP_DIVIDE: {
        const n = numAt(bytecode[++i])
        if (n === 2) {
          const b = stack[stackTop--]
          const a = stack[stackTop--]
          if (a === null || a === undefined || b === null || b === undefined) {
            stack[++stackTop] = false
            break
          }
          if (!isNumber(a) || !isNumber(b)) {
            throw new Error(
              `arithmetic operand is not a number: ${!isNumber(a) ? a : b}`
            )
          }
          if (op === OP_SUM) {
            stack[++stackTop] = addDecimals(a, b)
          } else if (op === OP_SUBTRACT) {
            stack[++stackTop] = subtractDecimals(a, b)
          } else if (op === OP_MULTIPLY) {
            stack[++stackTop] = multiplyDecimals(a, b)
          } else {
            stack[++stackTop] = divideDecimals(a, b)
          }
          break
        }
        const values: number[] = new Array(n)
        let hasNull = false
        for (let j = n - 1; j >= 0; j--) {
          const v = stack[stackTop--]
          if (v === null || v === undefined) {
            hasNull = true
            break
          }
          if (!isNumber(v)) {
            throw new Error(`arithmetic operand is not a number: ${v}`)
          }
          values[j] = v
        }
        stack[++stackTop] = hasNull ? false : arithmeticReduce(values, op)
        break
      }

      // -----------------------------------------------------------------------
      // Logical
      // -----------------------------------------------------------------------
      case OP_NOT: {
        const val = stack[stackTop]
        if (typeof val !== 'boolean') {
          throw new Error('NOT: operand must be boolean')
        }
        stack[stackTop] = !val
        break
      }

      case OP_XOR: {
        const b = stack[stackTop--]
        const a = stack[stackTop--]
        if (typeof a !== 'boolean' || typeof b !== 'boolean') {
          throw new Error('XOR: operands must be boolean')
        }
        stack[++stackTop] = (a || b) && !(a && b)
        break
      }

      case OP_JUMP_IF_FALSE: {
        const offset = numAt(bytecode[++i])
        if (stack[stackTop] === false) {
          i += offset
        }
        break
      }

      case OP_JUMP_IF_TRUE: {
        const offset = numAt(bytecode[++i])
        if (stack[stackTop] === true) {
          i += offset
        }
        break
      }

      case OP_POP:
        stackTop--
        break

      case OP_AND:
      case OP_OR:
      case OP_NOR:
        i++ // skip operand count
        break
    }

    snapshots.push({
      pc,
      op,
      opName,
      disasmLine: disasmByPc.get(pc) ?? `${pc}: ${opName}`,
      stackBefore,
      stackAfter: stack.slice(0, stackTop + 1),
      localsBefore,
      localsAfter: locals
        .slice(0, 64)
        .filter((_, idx) => locals[idx] !== undefined),
    })

    i++
  }

  return {
    snapshots,
    finalResult: stack[stackTop],
    compiled,
    disassembly,
    expression,
    context: ctx as Record<string, unknown>,
  }
}
