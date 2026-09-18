/**
 * Bytecode compiler.
 *
 * Transforms a raw ExpressionInput (plain array) into a flat Bytecode array
 * that the interpreter can execute. This runs once per unique expression;
 * the result should be cached and reused across evaluate() calls.
 */

import { Result } from '../common/evaluable.js'
import { isNumber } from '../common/type-check.js'
import { toDateDuration, toDateNumber } from '../common/util.js'
import { OPERATOR as OPERATOR_DIVIDE } from '../expression/arithmetic/divide.js'
import { OPERATOR as OPERATOR_MULTIPLY } from '../expression/arithmetic/multiply.js'
import { OPERATOR as OPERATOR_SUBTRACT } from '../expression/arithmetic/subtract.js'
import { OPERATOR as OPERATOR_SUM } from '../expression/arithmetic/sum.js'
import { OPERATOR as OPERATOR_EQ } from '../expression/comparison/eq.js'
import { OPERATOR as OPERATOR_GE } from '../expression/comparison/ge.js'
import { OPERATOR as OPERATOR_GT } from '../expression/comparison/gt.js'
import { OPERATOR as OPERATOR_IN } from '../expression/comparison/in.js'
import { OPERATOR as OPERATOR_LE } from '../expression/comparison/le.js'
import { OPERATOR as OPERATOR_LT } from '../expression/comparison/lt.js'
import { OPERATOR as OPERATOR_NE } from '../expression/comparison/ne.js'
import { OPERATOR as OPERATOR_NOT_IN } from '../expression/comparison/not-in.js'
import { OPERATOR as OPERATOR_OVERLAP } from '../expression/comparison/overlap.js'
import { OPERATOR as OPERATOR_PREFIX } from '../expression/comparison/prefix.js'
import { OPERATOR as OPERATOR_PRESENT } from '../expression/comparison/present.js'
import { OPERATOR as OPERATOR_SUFFIX } from '../expression/comparison/suffix.js'
import { OPERATOR as OPERATOR_UNDEFINED } from '../expression/comparison/undefined.js'
import { OPERATOR as OPERATOR_AND } from '../expression/logical/and.js'
import { OPERATOR as OPERATOR_NOR } from '../expression/logical/nor.js'
import { OPERATOR as OPERATOR_NOT } from '../expression/logical/not.js'
import { OPERATOR as OPERATOR_OR } from '../expression/logical/or.js'
import { OPERATOR as OPERATOR_XOR } from '../expression/logical/xor.js'
import { ArrayInput, ExpressionInput, Input } from '../parser/index.js'
import { Options } from '../parser/options.js'
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
import { buildCompactRef, CompactRef } from './refs.js'

// Bytecode is a flat array of numbers (opcodes and index operands) interspersed
// with literal Result values (for OP_PUSH_VALUE).
export type Bytecode = (number | Result)[]

// Lookup tables built once per Options instance — operator string → opcode.
// Stored outside emitExpression so they are not recreated on every compile call.
interface OperatorMaps {
  binary: Record<string, number>
  arithmetic: Record<string, number>
  sumOp: string
  subtractOp: string
  presentOp: string
  undefinedOp: string
  andOp: string
  orOp: string
  norOp: string
  notOp: string
  xorOp: string
  inOp: string
  notInOp: string
  overlapOp: string
  eqOp: string
  rootAllowed: Set<string>
  comparisonOps: Set<string>
  logicalOps: Set<string>
}

function getOperator(m: Map<symbol, string>, op: symbol): string {
  const v = m.get(op)
  if (v === undefined) {
    throw new Error(`operator mapping missing for symbol ${op.toString()}`)
  }
  return v
}

function buildOperatorMaps(opts: Options): OperatorMaps {
  const m = opts.operatorMapping
  const get = (op: symbol) => getOperator(m, op)

  const eqOp = get(OPERATOR_EQ)
  const neOp = get(OPERATOR_NE)
  const gtOp = get(OPERATOR_GT)
  const geOp = get(OPERATOR_GE)
  const ltOp = get(OPERATOR_LT)
  const leOp = get(OPERATOR_LE)
  const inOp = get(OPERATOR_IN)
  const notInOp = get(OPERATOR_NOT_IN)
  const prefixOp = get(OPERATOR_PREFIX)
  const suffixOp = get(OPERATOR_SUFFIX)
  const overlapOp = get(OPERATOR_OVERLAP)

  const sumOp = get(OPERATOR_SUM)
  const subtractOp = get(OPERATOR_SUBTRACT)
  const multiplyOp = get(OPERATOR_MULTIPLY)
  const divideOp = get(OPERATOR_DIVIDE)

  const presentOp = get(OPERATOR_PRESENT)
  const undefinedOp = get(OPERATOR_UNDEFINED)

  const andOp = get(OPERATOR_AND)
  const orOp = get(OPERATOR_OR)
  const norOp = get(OPERATOR_NOR)
  const notOp = get(OPERATOR_NOT)
  const xorOp = get(OPERATOR_XOR)

  const binary: Record<string, number> = {
    [eqOp]: OP_EQ,
    [neOp]: OP_NE,
    [gtOp]: OP_GT,
    [geOp]: OP_GE,
    [ltOp]: OP_LT,
    [leOp]: OP_LE,
    [inOp]: OP_IN,
    [notInOp]: OP_NOT_IN,
    [prefixOp]: OP_PREFIX,
    [suffixOp]: OP_SUFFIX,
    [overlapOp]: OP_OVERLAP,
  }

  const arithmetic: Record<string, number> = {
    [sumOp]: OP_SUM,
    [subtractOp]: OP_SUBTRACT,
    [multiplyOp]: OP_MULTIPLY,
    [divideOp]: OP_DIVIDE,
  }

  const comparisonOps = new Set<string>([
    ...Object.keys(binary),
    presentOp,
    undefinedOp,
  ])

  const logicalOps = new Set<string>([andOp, orOp, norOp, notOp, xorOp])

  const rootAllowed = new Set<string>([...comparisonOps, ...logicalOps])

  return {
    binary,
    arithmetic,
    sumOp,
    subtractOp,
    presentOp,
    undefinedOp,
    andOp,
    orOp,
    norOp,
    notOp,
    xorOp,
    inOp,
    notInOp,
    overlapOp,
    eqOp,
    rootAllowed,
    comparisonOps,
    logicalOps,
  }
}

const operatorMapsCache = new WeakMap<Options, OperatorMaps>()

function getOrCreateOperatorMaps(opts: Options): OperatorMaps {
  let maps = operatorMapsCache.get(opts)
  if (!maps) {
    maps = buildOperatorMaps(opts)
    operatorMapsCache.set(opts, maps)
  }
  return maps
}

const opNamesReverseMapCache = new WeakMap<
  OperatorMaps,
  Record<number, string>
>()

function getOrCreateReverseOpNames(maps: OperatorMaps): Record<number, string> {
  let opNames = opNamesReverseMapCache.get(maps)
  if (!opNames) {
    // Build reverse map: opcode → operator string for residual reconstruction
    opNames = {}
    for (const [str, code] of Object.entries(maps.binary)) {
      opNames[code] = str
    }
    for (const [str, code] of Object.entries(maps.arithmetic)) {
      opNames[code] = str
    }
    opNames[OP_NOT] = maps.notOp
    opNames[OP_AND] = maps.andOp
    opNames[OP_OR] = maps.orOp
    opNames[OP_NOR] = maps.norOp
    opNames[OP_XOR] = maps.xorOp
    opNames[OP_PRESENT] = maps.presentOp
    opNames[OP_UNDEFINED] = maps.undefinedOp
    opNames[OP_IN_COLLECTION] = maps.inOp
    opNames[OP_NOT_IN_COLLECTION] = maps.notInOp
    opNames[OP_IN_CONST] = maps.inOp
    opNames[OP_NOT_IN_CONST] = maps.notInOp
    opNames[OP_OVERLAP_CONST] = maps.overlapOp
    opNames[OP_OVERLAP_SCAN_REFS_CONST] = maps.overlapOp
    opNames[OP_IN_SCAN_REFS_CONST] = maps.inOp
    opNames[OP_NOT_IN_SCAN_REFS_CONST] = maps.notInOp

    opNamesReverseMapCache.set(maps, opNames)
  }

  return opNames
}

export interface CompilerState {
  bytecode: Bytecode
  refs: CompactRef[] // side-table of compact refs, indexed by position
  refIndex: Map<string, number> // dedup map: raw key → index into refs
  refRawKeys: string[] // raw key per ref index (post-transform, for strictKeys/optionalKeys checks)
  refKeys: string[] // serialized key per ref index (for residual reconstruction, e.g. '$RefA')
  opts: Options
  maps: OperatorMaps
  // CSE: canonical key → local slot index for dynamic collections seen >1 time
  collectionCse: Map<string, number>
  numLocals: number
  // Static collection constants table — interned by JSON key, zero allocation at runtime
  consts: ArrayInput[]
  constIndex: Map<string, number>
  // Side tables for the simplify interpreter
  overlapRefsEntries: Array<{ pos: number; refIdxs: number[] }>
  directionEntries: Array<{ pos: number; dir: 0 | 1 }>
}

function isStaticCollection(raw: Input, opts: Options): raw is ArrayInput {
  return (
    Array.isArray(raw) &&
    !raw.some((v) => typeof v === 'string' && opts.referencePredicate(v))
  )
}

function isPureRefCollection(raw: Input, opts: Options): raw is string[] {
  return (
    Array.isArray(raw) &&
    raw.length > 0 &&
    raw.every((v) => typeof v === 'string' && opts.referencePredicate(v))
  )
}

function internConst(items: ArrayInput, state: CompilerState): number {
  const key = JSON.stringify(items)
  let idx = state.constIndex.get(key)
  if (idx === undefined) {
    idx = state.consts.length
    state.consts.push(items)
    state.constIndex.set(key, idx)
  }
  return idx
}

/**
 * Returns the first context key for a multi-key ref (e.g. 'account' for $account.region),
 * or undefined for single-key refs (no heuristic needed) and dynamic refs (unknowable statically).
 * Used by the simplify interpreter to replicate OOP Reference.simplify()'s first-key check.
 */
function getFirstCtxKey(ref: CompactRef): string | undefined {
  if (typeof ref === 'string') {
    return undefined // single-key ref — OOP checks ctx[key] directly, no first-key shortcut
  }
  if (Array.isArray(ref)) {
    return ref[0] // multi-key path: first element is the top-level context key
  }
  if (ref.d) {
    return undefined // dynamic ref with {placeholder}: can't determine first key statically
  }
  const tokens = ref.tokens
  if (tokens && tokens.length > 0 && tokens[0].kind === 'key') {
    return tokens[0].value
  }
  return undefined
}

function refOpcode(ref: CompactRef): number {
  if (typeof ref === 'string') {
    return OP_PUSH_REF_KEY
  }
  if (Array.isArray(ref)) {
    return OP_PUSH_REF_KEYS
  }
  if (ref.d) {
    return OP_PUSH_REF_DYNAMIC
  }
  return OP_PUSH_REF_TOKENS
}

function internRef(raw: string, state: CompilerState): number {
  const key = state.opts.referenceTransform(raw)
  let refIndex = state.refIndex.get(key)
  if (refIndex === undefined) {
    refIndex = state.refs.length
    state.refs.push(buildCompactRef(key))
    state.refIndex.set(key, refIndex)
    state.refRawKeys.push(key)
    state.refKeys.push(raw)
  }
  return refIndex
}

function isLogicalOrComparison(op: Input, maps: OperatorMaps): boolean {
  if (!Array.isArray(op) || op.length === 0 || typeof op[0] !== 'string') {
    return false
  }
  const operator = op[0]
  if (maps.comparisonOps.has(operator)) {
    return true
  }
  if (maps.logicalOps.has(operator)) {
    const operands = op.slice(1)
    const isExpr = (child: Input): boolean =>
      Array.isArray(child) &&
      child.length > 0 &&
      typeof child[0] === 'string' &&
      (maps.comparisonOps.has(child[0]) ||
        maps.logicalOps.has(child[0]) ||
        child[0] in maps.arithmetic)

    if (operands.length === 0 || !operands.some(isExpr)) {
      return false
    }
    if (
      (operator === maps.andOp || operator === maps.orOp) &&
      operands.length === 1
    ) {
      return isLogicalOrComparison(operands[0], maps)
    }
    return true
  }
  return false
}

function emitOperand(raw: Input, state: CompilerState): void {
  const { bytecode, refs, opts } = state

  if (Array.isArray(raw)) {
    const hasDynamic = raw.some(
      (v) => typeof v === 'string' && opts.referencePredicate(v)
    )

    if (hasDynamic) {
      // CSE: if this dynamic collection has been seen before, reuse the cached local slot
      const cseKey = JSON.stringify(raw)
      const existingSlot = state.collectionCse.get(cseKey)
      if (existingSlot !== undefined) {
        bytecode.push(OP_LOAD_LOCAL, existingSlot)
        return
      }
      // First occurrence: emit normally, then store result in a new local slot
      for (const item of raw) {
        emitOperand(item, state)
      }
      bytecode.push(OP_MAKE_COLLECTION, raw.length)
      const slot = state.numLocals++
      state.collectionCse.set(cseKey, slot)
      bytecode.push(OP_STORE_LOCAL, slot)
      return
    }

    // Static collection: intern into consts table, emit OP_PUSH_CONST
    bytecode.push(OP_PUSH_CONST, internConst(raw, state))
    return
  }

  if (typeof raw === 'string' && opts.referencePredicate(raw)) {
    const refIndex = internRef(raw, state)
    bytecode.push(refOpcode(refs[refIndex]), refIndex)
    return
  }

  bytecode.push(OP_PUSH_VALUE, raw)
}

// arr[0] is the operator; operands are arr[1..arr.length-1]
function emitShortCircuit(
  opts: Options,
  arr: ArrayInput,
  jumpOp: typeof OP_JUMP_IF_FALSE | typeof OP_JUMP_IF_TRUE,
  markerOp: typeof OP_AND | typeof OP_OR | typeof OP_NOR,
  state: CompilerState
): void {
  const { bytecode } = state
  const jumpSlots: number[] = []
  const last = arr.length - 1

  bytecode.push(OP_ENTER_SCOPE)

  for (let i = 1; i < last; i++) {
    emitExpression(opts, arr[i], state)
    bytecode.push(jumpOp)
    jumpSlots.push(bytecode.length)
    bytecode.push(0) // placeholder — backpatched below
    bytecode.push(OP_POP) // discard result before evaluating next operand
  }

  emitExpression(opts, arr[last], state)

  const end = bytecode.length
  for (const slot of jumpSlots) {
    bytecode[slot] = end - slot - 1
  }

  // Emit marker so the simplify interpreter knows the operator and operand count
  bytecode.push(markerOp, last)
}

function dateArithmeticTypeCheck(opts: Options, operands: Input[]): void {
  const first = operands[0]

  let restAreAllReferences = true
  let valuesAreAllDurations = true
  let valuesAreAllNumbers = true

  for (let i = 1; i < operands.length; i++) {
    const op = operands[i]
    const isReference = typeof op === 'string' && opts.referencePredicate(op)
    if (!isReference) {
      restAreAllReferences = false
      const isValue = (!Array.isArray(op) && !isReference) || op === null
      if (isValue) {
        if (!toDateDuration(op)) {
          valuesAreAllDurations = false
        }
        if (!isNumber(op)) {
          valuesAreAllNumbers = false
        }
      }
    }
  }

  const isFirstReference =
    typeof first === 'string' && opts.referencePredicate(first)
  const isFirstValue =
    (!Array.isArray(first) && !isFirstReference) || first === null

  if (isFirstReference) {
    if (
      !restAreAllReferences &&
      !valuesAreAllDurations &&
      !valuesAreAllNumbers
    ) {
      throw new Error(
        'sum expression value literals should be all numbers or all date durations'
      )
    }
  } else if (isFirstValue) {
    if (isNumber(first)) {
      if (!restAreAllReferences && !valuesAreAllNumbers) {
        throw new Error('sum expression value literals should be all numbers')
      }
    } else {
      if (!isNaN(toDateNumber(first))) {
        if (!restAreAllReferences && !valuesAreAllDurations) {
          throw new Error(
            'sum expression value literals should be all date durations'
          )
        }
      } else {
        throw new Error(
          'sum expression value literals should be all numbers or starting ' +
            'with an iso date string followed by date durations'
        )
      }
    }
  }
}

function validateLogicalOperands(operands: Input[], maps: OperatorMaps): void {
  if (operands.length < 2) {
    throw new Error('logical expression must have at least two operands')
  }
  for (const op of operands) {
    if (Array.isArray(op) && typeof op[0] === 'string') {
      if (op[0] in maps.arithmetic) {
        throw new Error('invalid expression')
      }
    }
  }
}

const isExpression =
  (maps: OperatorMaps) =>
  (op: Input): boolean =>
    Array.isArray(op) &&
    op.length > 0 &&
    typeof op[0] === 'string' &&
    (maps.comparisonOps.has(op[0]) ||
      maps.logicalOps.has(op[0]) ||
      op[0] in maps.arithmetic)

function emitExpression(opts: Options, raw: Input, state: CompilerState): void {
  const { bytecode, maps } = state

  if (!Array.isArray(raw)) {
    emitOperand(raw, state)
    return
  }

  const arr = raw
  const operator = arr[0]
  const operands = arr.slice(1)
  const nOperands = arr.length - 1

  if (typeof operator !== 'string') {
    emitOperand(raw, state)
    return
  }

  // ---------------------------------------------------------------------------
  // Logical — short-circuit with jump instructions
  // ---------------------------------------------------------------------------

  const isLogicalOp = maps.logicalOps.has(operator)

  if (isLogicalOp) {
    const isExpr = isExpression(maps)

    // Logical expressions without operands or with no expression operands are treated as collections
    if (operands.length === 0 || !operands.some(isExpr)) {
      emitOperand(raw, state)
      return
    }

    // AND / OR with a single operand collapse to the inner expression
    const collapsible = operator === maps.andOp || operator === maps.orOp
    if (collapsible && operands.length === 1) {
      emitExpression(opts, operands[0], state)
      return
    }

    // logicalIfValidOperands: all operands must be Logical or Comparison
    if (!operands.every((op) => isLogicalOrComparison(op, maps))) {
      throw new Error('invalid expression')
    }
  }

  if (operator === maps.andOp) {
    validateLogicalOperands(operands, maps)
    emitShortCircuit(opts, arr, OP_JUMP_IF_FALSE, OP_AND, state)
    return
  }

  if (operator === maps.orOp) {
    validateLogicalOperands(operands, maps)
    emitShortCircuit(opts, arr, OP_JUMP_IF_TRUE, OP_OR, state)
    return
  }

  if (operator === maps.norOp) {
    validateLogicalOperands(operands, maps)
    // NOR = NOT OR: emit as OR with short-circuit, then negate
    emitShortCircuit(opts, arr, OP_JUMP_IF_TRUE, OP_NOR, state)
    bytecode.push(OP_NOT)
    return
  }

  if (operator === maps.notOp) {
    if (arr.length !== 2) {
      throw new Error('logical NOT expression must have exactly one operand')
    }
    emitExpression(opts, arr[1], state)
    bytecode.push(OP_NOT)
    return
  }

  if (operator === maps.xorOp) {
    validateLogicalOperands(operands, maps)
    // XOR is associative: chain binary XOR operations
    // (A XOR B) XOR C XOR D ...
    emitExpression(opts, arr[1], state)
    for (let i = 2; i <= nOperands; i++) {
      emitExpression(opts, arr[i], state)
      bytecode.push(OP_XOR)
    }
    return
  }

  // ---------------------------------------------------------------------------
  // Comparison — binary (left, right)
  // ---------------------------------------------------------------------------

  // IN / NOT_IN: optimized paths when one operand is a collection
  if (operator === maps.inOp || operator === maps.notInOp) {
    const left = arr[1]
    const right = arr[2]
    if (Array.isArray(left) && !Array.isArray(right)) {
      const leftArr: ArrayInput = left
      const leftHasDynamic = leftArr.some(
        (v) => typeof v === 'string' && state.opts.referencePredicate(v)
      )
      const constOp = operator === maps.inOp ? OP_IN_CONST : OP_NOT_IN_CONST
      const collectionOp =
        operator === maps.inOp ? OP_IN_COLLECTION : OP_NOT_IN_COLLECTION
      if (!leftHasDynamic) {
        // fully static collection on left — intern as const, Set-lookup the scalar
        emitExpression(opts, right, state)
        const opcodePos = bytecode.length
        bytecode.push(constOp, internConst(leftArr, state))
        state.directionEntries.push({ pos: opcodePos, dir: 0 })
      } else if (
        isPureRefCollection(leftArr, state.opts) &&
        !(typeof right === 'string' && state.opts.referencePredicate(right))
      ) {
        // pure-ref collection on left, concrete scalar on right — inline ref scan, no stack alloc
        const scanOp =
          operator === maps.inOp
            ? OP_IN_SCAN_REFS_CONST
            : OP_NOT_IN_SCAN_REFS_CONST
        const constIdx = internConst([right], state)
        const opcodePos = bytecode.length
        const refIdxs: number[] = []
        bytecode.push(scanOp, leftArr.length)
        for (const item of leftArr) {
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos: opcodePos, dir: 0 })
        state.overlapRefsEntries.push({ pos: opcodePos, refIdxs })
      } else {
        // mixed dynamic collection on left — inline stack scan
        for (const item of leftArr) {
          emitOperand(item, state)
        }
        emitExpression(opts, right, state)
        const opcodePos = bytecode.length
        bytecode.push(collectionOp, leftArr.length)
        state.directionEntries.push({ pos: opcodePos, dir: 0 })
      }
      return
    }
    if (Array.isArray(right) && !Array.isArray(left)) {
      const rightArr: ArrayInput = right
      const rightHasDynamic = rightArr.some(
        (v) => typeof v === 'string' && state.opts.referencePredicate(v)
      )
      const constOp = operator === maps.inOp ? OP_IN_CONST : OP_NOT_IN_CONST
      const collectionOp =
        operator === maps.inOp ? OP_IN_COLLECTION : OP_NOT_IN_COLLECTION
      if (!rightHasDynamic) {
        // fully static collection on right — intern as const, Set-lookup the scalar
        emitExpression(opts, left, state)
        const opcodePos = bytecode.length
        bytecode.push(constOp, internConst(rightArr, state))
        state.directionEntries.push({ pos: opcodePos, dir: 1 })
      } else if (
        isPureRefCollection(rightArr, state.opts) &&
        !(typeof left === 'string' && state.opts.referencePredicate(left))
      ) {
        // pure-ref collection on right, concrete scalar on left — inline ref scan, no stack alloc
        const scanOp =
          operator === maps.inOp
            ? OP_IN_SCAN_REFS_CONST
            : OP_NOT_IN_SCAN_REFS_CONST
        const constIdx = internConst([left], state)
        const opcodePos = bytecode.length
        const refIdxs: number[] = []
        bytecode.push(scanOp, rightArr.length)
        for (const item of rightArr) {
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos: opcodePos, dir: 1 })
        state.overlapRefsEntries.push({ pos: opcodePos, refIdxs })
      } else {
        // mixed dynamic collection on right — inline stack scan
        for (const item of rightArr) {
          emitOperand(item, state)
        }
        emitExpression(opts, left, state)
        const opcodePos = bytecode.length
        bytecode.push(collectionOp, rightArr.length)
        state.directionEntries.push({ pos: opcodePos, dir: 1 })
      }
      return
    }
    // both sides are dynamic (refs) — fall through to generic OP_IN / OP_NOT_IN
  }

  // OVERLAP: if exactly one operand is a static collection, emit optimized path
  if (operator === maps.overlapOp) {
    const left = arr[1]
    const right = arr[2]

    if (
      isStaticCollection(left, state.opts) &&
      !isStaticCollection(right, state.opts)
    ) {
      const constIdx = internConst(left, state)
      if (isPureRefCollection(right, state.opts)) {
        // dynamic side is all refs — inline ref indices, resolve+check at runtime, no stack alloc
        const opcodePos = bytecode.length
        bytecode.push(OP_OVERLAP_SCAN_REFS_CONST, right.length)
        const refIdxs: number[] = []
        for (const item of right) {
          if (typeof item !== 'string') {
            throw new Error(
              'OVERLAP: expected string ref in pure-ref collection'
            )
          }
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos: opcodePos, dir: 0 })
        state.overlapRefsEntries.push({ pos: opcodePos, refIdxs })
      } else {
        emitExpression(opts, right, state)
        const opcodePos = bytecode.length
        bytecode.push(OP_OVERLAP_CONST, constIdx)
        state.directionEntries.push({ pos: opcodePos, dir: 0 })
      }
      return
    }
    if (
      isStaticCollection(right, state.opts) &&
      !isStaticCollection(left, state.opts)
    ) {
      const constIdx = internConst(right, state)
      if (isPureRefCollection(left, state.opts)) {
        // dynamic side is all refs — inline ref indices, resolve+check at runtime, no stack alloc
        const opcodePos = bytecode.length
        bytecode.push(OP_OVERLAP_SCAN_REFS_CONST, left.length)
        const refIdxs: number[] = []
        for (const item of left) {
          if (typeof item !== 'string') {
            throw new Error(
              'OVERLAP: expected string ref in pure-ref collection'
            )
          }
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos: opcodePos, dir: 1 })
        state.overlapRefsEntries.push({ pos: opcodePos, refIdxs })
      } else {
        emitExpression(opts, left, state)
        const opcodePos = bytecode.length
        bytecode.push(OP_OVERLAP_CONST, constIdx)
        state.directionEntries.push({ pos: opcodePos, dir: 1 })
      }
      return
    }
    // Both static or both dynamic: fall through to generic OP_OVERLAP
  }

  if (operator in maps.binary) {
    if (arr.length !== 3) {
      throw new Error('comparison expression expects left and right operands')
    }
    emitExpression(opts, arr[1], state)
    emitExpression(opts, arr[2], state)
    bytecode.push(maps.binary[operator])
    return
  }

  // ---------------------------------------------------------------------------
  // Unary comparison
  // ---------------------------------------------------------------------------
  if (operator === maps.presentOp) {
    emitExpression(opts, arr[1], state)
    bytecode.push(OP_PRESENT)
    return
  }

  if (operator === maps.undefinedOp) {
    emitExpression(opts, arr[1], state)
    bytecode.push(OP_UNDEFINED)
    return
  }

  // ---------------------------------------------------------------------------
  // Arithmetic — N operands
  // ---------------------------------------------------------------------------
  if (operator in maps.arithmetic) {
    if (operator === maps.sumOp || operator === maps.subtractOp) {
      dateArithmeticTypeCheck(opts, operands)
    }
    for (const operand of operands) {
      emitExpression(opts, operand, state)
    }
    bytecode.push(maps.arithmetic[operator], nOperands)
    return
  }

  // ---------------------------------------------------------------------------
  // Fallback: treat as collection (array of values/refs)
  // ---------------------------------------------------------------------------
  emitOperand(raw, state)
}

export interface CompiledExpression {
  bytecode: Bytecode
  refs: CompactRef[]
  numLocals: number
  consts: ArrayInput[]
  // opcode → operator string, used by the simplify interpreter for residual reconstruction
  opNames: Record<number, string>
  // serialized ref key per ref index (e.g. '$RefA'), used for residual output
  refKeys: string[]
  // raw ref key per ref index (post-transform, e.g. 'RefA'), used for strictKeys/optionalKeys checks
  refRawKeys: string[]
  // pre-built residual ref arrays for OP_OVERLAP_SCAN_REFS_CONST, keyed by bytecode position
  overlapRefsResiduals: Array<[number, Input[]]>
  // bytecode position → direction (0 = collection/const on left, 1 = on right) for IN/OVERLAP opcodes
  directionMap: Array<[number, 0 | 1]>
  // First context key per ref index: undefined for single-key refs, string for multi-key refs.
  // Used by the simplify interpreter to match OOP Reference.simplify() behavior:
  // if ctx[firstCtxKey] !== undefined, treat undefined sub-fields as concrete rather than unknown.
  refFirstCtxKeys: (string | undefined)[]
}

/**
 * Compile a raw ExpressionInput into bytecode.
 * The result should be cached and reused across evaluate() calls.
 */
export function compile(
  raw: ExpressionInput,
  opts: Options
): CompiledExpression {
  // Validate root expression — must be an array with a string operator
  if (!Array.isArray(raw) || typeof raw[0] !== 'string') {
    throw new Error('invalid expression')
  }

  const rootOp = raw[0]
  const maps = getOrCreateOperatorMaps(opts)

  // Validate root operator — arithmetic or unknown operators cannot be root operators
  if (!maps.rootAllowed.has(rootOp)) {
    throw new Error('invalid expression')
  }

  const state: CompilerState = {
    bytecode: [],
    refs: [],
    refIndex: new Map(),
    refRawKeys: [],
    refKeys: [],
    opts,
    maps,
    collectionCse: new Map(),
    numLocals: 0,
    consts: [],
    constIndex: new Map(),
    overlapRefsEntries: [],
    directionEntries: [],
  }
  emitExpression(opts, raw, state)

  const opNames = getOrCreateReverseOpNames(maps)

  // Pre-build residual Input[] arrays for OP_OVERLAP_SCAN_REFS_CONST — eliminates per-call allocation in the simplifier
  const overlapRefsResiduals: Array<[number, Input[]]> =
    state.overlapRefsEntries.map(({ pos, refIdxs }) => [
      pos,
      refIdxs.map((idx) => state.refKeys[idx]),
    ])

  // Build direction entries as serializable tuple array
  const directionMap: Array<[number, 0 | 1]> = state.directionEntries.map(
    ({ pos, dir }) => [pos, dir]
  )

  return {
    bytecode: state.bytecode,
    refs: state.refs,
    numLocals: state.numLocals,
    consts: state.consts,
    opNames,
    refKeys: state.refKeys,
    refRawKeys: state.refRawKeys,
    overlapRefsResiduals,
    directionMap,
    refFirstCtxKeys: state.refs.map(getFirstCtxKey),
  }
}
