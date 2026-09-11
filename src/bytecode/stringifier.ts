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
import { literalAt, numAt, requireMapEntry } from './simplifier.js'

// Per-compiled-expression Map caches
const overlapRefsResidualsCache = new WeakMap<
  CompiledExpression,
  Map<number, Input[]>
>()
const directionMapCache = new WeakMap<CompiledExpression, Map<number, 0 | 1>>()

// Pre-allocated stack and buffers
const MAX_STACK = 512
const stack: string[] = new Array(MAX_STACK)
let stackTop = -1

const MAX_LOCALS = 64
const locals: string[] = new Array(MAX_LOCALS)

const spillBuf: string[] = new Array(MAX_STACK)
let spillTop = -1

const scopeStack: number[] = new Array(MAX_STACK)
let scopeStackTop = -1

function formatRef(raw: string): string {
  let path = raw.replace(/^[$#]/, '')
  path = path.replace(/\.\([a-zA-Z0-9_-]+\)$/, '')
  return `{${path}}`
}

function formatValue(val: unknown): string {
  if (typeof val === 'string') {
    return JSON.stringify(val)
  }
  if (val === null) {
    return 'null'
  }
  if (typeof val === 'number' || typeof val === 'boolean') {
    return String(val)
  }
  if (Array.isArray(val)) {
    return '[' + val.map(formatValue).join(', ') + ']'
  }
  return String(val)
}

function formatCollectionItem(item: unknown): string {
  if (
    typeof item === 'string' &&
    (item.startsWith('$') || item.startsWith('#'))
  ) {
    return formatRef(item)
  }
  return formatValue(item)
}

export function stringify(compiled: CompiledExpression): string {
  const { bytecode, refKeys, opNames } = compiled
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
  let lastOp = -1
  const len = bytecode.length

  while (i < len) {
    const op = numAt(bytecode[i++])

    switch (op) {
      case OP_PUSH_VALUE:
        stack[++stackTop] = formatValue(literalAt(bytecode[i++]))
        break

      case OP_PUSH_REF_KEY:
      case OP_PUSH_REF_KEYS:
      case OP_PUSH_REF_TOKENS:
      case OP_PUSH_REF_DYNAMIC:
        stack[++stackTop] = formatRef(refKeys[numAt(bytecode[i++])])
        break

      case OP_MAKE_COLLECTION: {
        const n = numAt(bytecode[i++])
        const items: string[] = new Array(n)
        for (let j = n - 1; j >= 0; j--) {
          items[j] = stack[stackTop--]
        }
        stack[++stackTop] = '[' + items.join(', ') + ']'
        break
      }

      case OP_PUSH_CONST:
        stack[++stackTop] = formatValue(compiled.consts[numAt(bytecode[i++])])
        break

      case OP_OVERLAP_CONST: {
        const opcodePos = i - 1
        const constArr = compiled.consts[numAt(bytecode[i++])]
        const constOnLeft = directionMap.get(opcodePos) === 0
        const dynamic = stack[stackTop--]
        const constStr = formatValue(constArr)
        stack[++stackTop] = constOnLeft
          ? `(${constStr} overlap ${dynamic})`
          : `(${dynamic} overlap ${constStr})`
        break
      }

      case OP_OVERLAP_SCAN_REFS_CONST: {
        const opcodePos = i - 1
        const n = numAt(bytecode[i++])
        i += n
        const constIdx = numAt(bytecode[i++])
        const constArr = compiled.consts[constIdx]
        const constOnLeft = directionMap.get(opcodePos) === 0
        const refInputs = requireMapEntry(overlapRefsResiduals, opcodePos)
        const constStr = formatValue(constArr)
        const refStr =
          '[' + refInputs.map(formatCollectionItem).join(', ') + ']'
        stack[++stackTop] = constOnLeft
          ? `(${constStr} overlap ${refStr})`
          : `(${refStr} overlap ${constStr})`
        break
      }

      case OP_IN_SCAN_REFS_CONST:
      case OP_NOT_IN_SCAN_REFS_CONST: {
        const opcodePos = i - 1
        const n = numAt(bytecode[i++])
        i += n
        const constIdx = numAt(bytecode[i++])
        const constArr = compiled.consts[constIdx]
        const refInputs = requireMapEntry(overlapRefsResiduals, opcodePos)
        const scalar = formatValue(constArr[0])
        const collectionStr =
          '[' + refInputs.map(formatCollectionItem).join(', ') + ']'
        stack[++stackTop] =
          op === OP_IN_SCAN_REFS_CONST
            ? `(${scalar} in ${collectionStr})`
            : `(${scalar} not in ${collectionStr})`
        break
      }

      case OP_STORE_LOCAL:
        locals[numAt(bytecode[i++])] = stack[stackTop]
        break

      case OP_LOAD_LOCAL:
        stack[++stackTop] = locals[numAt(bytecode[i++])]
        break

      case OP_EQ: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left} == ${right})`
        break
      }

      case OP_NE: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left} != ${right})`
        break
      }

      case OP_GT: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left} > ${right})`
        break
      }

      case OP_GE: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left} >= ${right})`
        break
      }

      case OP_LT: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left} < ${right})`
        break
      }

      case OP_LE: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left} <= ${right})`
        break
      }

      case OP_PREFIX: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(<${left}>${right})`
        break
      }

      case OP_SUFFIX: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left}<${right}>)`
        break
      }

      case OP_OVERLAP: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        stack[++stackTop] = `(${left} overlap ${right})`
        break
      }

      case OP_IN:
      case OP_NOT_IN: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        let candidate = left
        let collection = right
        if (
          left.startsWith('[') &&
          left.endsWith(']') &&
          !(right.startsWith('[') && right.endsWith(']'))
        ) {
          candidate = right
          collection = left
        }
        stack[++stackTop] =
          op === OP_IN
            ? `(${candidate} in ${collection})`
            : `(${candidate} not in ${collection})`
        break
      }

      case OP_IN_COLLECTION:
      case OP_NOT_IN_COLLECTION: {
        const n = numAt(bytecode[i++])
        const scalar = stack[stackTop--]
        const items: string[] = new Array(n)
        for (let j = 0; j < n; j++) {
          items[j] = stack[stackTop - (n - 1 - j)]
        }
        stackTop -= n
        const collectionStr = '[' + items.join(', ') + ']'
        stack[++stackTop] =
          op === OP_IN_COLLECTION
            ? `(${scalar} in ${collectionStr})`
            : `(${scalar} not in ${collectionStr})`
        break
      }

      case OP_IN_CONST:
      case OP_NOT_IN_CONST: {
        const constArr = compiled.consts[numAt(bytecode[i++])]
        const scalar = stack[stackTop--]
        const constStr = formatValue(constArr)
        stack[++stackTop] =
          op === OP_IN_CONST
            ? `(${scalar} in ${constStr})`
            : `(${scalar} not in ${constStr})`
        break
      }

      case OP_OR_AND_IN_CONST_2: {
        const ref1Idx = numAt(bytecode[i++])
        const ref2Idx = numAt(bytecode[i++])
        const n = numAt(bytecode[i++])
        const quadsStart = i
        i += n * 4

        const r1Str = formatRef(refKeys[ref1Idx])
        const r2Str = formatRef(refKeys[ref2Idx])
        const branches: string[] = []

        for (let j = 0; j < n; j++) {
          const aVal = literalAt(bytecode[quadsStart + j * 4])
          const setB = compiled.consts[numAt(bytecode[quadsStart + j * 4 + 1])]
          const ref1OpByte = numAt(bytecode[quadsStart + j * 4 + 2])
          const ref2OpByte = numAt(bytecode[quadsStart + j * 4 + 3])

          const branch1 =
            ref1OpByte === 1
              ? `(${r1Str} in [${formatValue(aVal)}])`
              : `(${r1Str} == ${formatValue(aVal)})`

          let branch2: string
          if (ref2OpByte === 1) {
            branch2 = `(${r2Str} in ${formatValue(setB)})`
          } else if (Array.isArray(setB) && setB.length === 1) {
            branch2 = `(${r2Str} == ${formatValue(setB[0])})`
          } else {
            branch2 = `(${r2Str} == ${formatValue(setB)})`
          }

          branches.push(`(${branch1} AND ${branch2})`)
        }

        stack[++stackTop] =
          branches.length === 1 ? branches[0] : `(${branches.join(' OR ')})`
        break
      }

      case OP_PRESENT:
        stack[stackTop] = `(${stack[stackTop]} is PRESENT)`
        break

      case OP_UNDEFINED:
        stack[stackTop] = `(${stack[stackTop]} is UNDEFINED)`
        break

      case OP_SUM:
      case OP_SUBTRACT:
      case OP_MULTIPLY:
      case OP_DIVIDE: {
        const n = numAt(bytecode[i++])
        const items: string[] = new Array(n)
        for (let j = n - 1; j >= 0; j--) {
          items[j] = stack[stackTop--]
        }
        const sym =
          op === OP_SUM
            ? ' + '
            : op === OP_SUBTRACT
              ? ' - '
              : op === OP_MULTIPLY
                ? ' * '
                : ' / '
        stack[++stackTop] = `(${items.join(sym)})`
        break
      }

      case OP_NOT:
        if (lastOp !== OP_NOR) {
          stack[stackTop] = `(${stack[stackTop]})`
        }
        break

      case OP_JUMP_IF_FALSE:
      case OP_JUMP_IF_TRUE:
        i++
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
        if (top === `"${opNames[op]}"`) {
          stack[++stackTop] = `[${top}]`
          break
        }
        const base = scopeStack[scopeStackTop--]
        const operands: string[] = []
        for (let j = base + 1; j <= spillTop; j++) {
          operands.push(spillBuf[j])
        }
        spillTop = base
        operands.push(top)
        if (operands.length === 1) {
          stack[++stackTop] = operands[0]
          break
        }
        const opName = op === OP_AND ? 'AND' : op === OP_OR ? 'OR' : 'NOR'
        stack[++stackTop] = `(${operands.join(` ${opName} `)})`
        break
      }

      case OP_XOR: {
        const b = stack[stackTop--]
        const a = stack[stackTop--]
        if (a.startsWith('(') && a.endsWith(')') && a.includes(' XOR ')) {
          stack[++stackTop] = `(${a.slice(1, -1)} XOR ${b})`
        } else {
          stack[++stackTop] = `(${a} XOR ${b})`
        }
        break
      }

      /* node:coverage ignore next 2 */
      default:
        throw new Error(`unknown opcode: ${op}`)
    }

    lastOp = op
  }

  return stack[stackTop]
}
