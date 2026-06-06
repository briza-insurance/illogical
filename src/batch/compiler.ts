/**
 * Batch compiler.
 *
 * Compiles multiple expressions into a single CompiledBatch, reusing
 * emitExpression internals from the single-expression compiler but with
 * shared state across all expressions. This enables:
 * - Ref deduplication across expressions (sharedRefs[])
 * - Const deduplication across expressions (sharedConsts[])
 * - Shared locals pool (each expression gets [base, base+numLocals))
 *
 * DO NOT duplicate emitExpression logic — we reuse the exact same
 * emitExpression implementation from compiler.ts.
 */

import { Bytecode } from '../bytecode/compiler.js'
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
import { buildCompactRef, CompactRef } from '../bytecode/refs.js'
import { Result } from '../common/evaluable.js'
import {
  OPERATOR_AND,
  OPERATOR_DIVIDE,
  OPERATOR_EQ,
  OPERATOR_GE,
  OPERATOR_GT,
  OPERATOR_IN,
  OPERATOR_LE,
  OPERATOR_LT,
  OPERATOR_MULTIPLY,
  OPERATOR_NE,
  OPERATOR_NOR,
  OPERATOR_NOT,
  OPERATOR_NOT_IN,
  OPERATOR_OR,
  OPERATOR_OVERLAP,
  OPERATOR_PREFIX,
  OPERATOR_PRESENT,
  OPERATOR_SUBTRACT,
  OPERATOR_SUFFIX,
  OPERATOR_SUM,
  OPERATOR_UNDEFINED,
  OPERATOR_XOR,
} from '../operator.js'
import { ExpressionInput, Input } from '../parser/index.js'
import { Options } from '../parser/options.js'
import { buildDependencyGraph } from './dependency-graph.js'
import { CompiledBatch, CompiledBatchExpression } from './types.js'

// ---------------------------------------------------------------------------
// Shared CompilerState — mirrors the internal CompilerState from compiler.ts
// ---------------------------------------------------------------------------

interface OperatorMaps {
  binary: Record<string, number>
  arithmetic: Record<string, number>
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
}

interface CompilerState {
  bytecode: Bytecode
  refs: CompactRef[]
  refIndex: Map<string, number>
  refRawKeys: string[]
  refKeys: string[]
  opts: Options
  maps: OperatorMaps
  collectionCse: Map<string, number>
  consts: Input[][]
  constIndex: Map<string, number>
  overlapRefsEntries: Array<{ pos: number; refIdxs: number[] }>
  directionEntries: Array<{ pos: number; dir: 0 | 1 }>
}

// ---------------------------------------------------------------------------
// Helper functions (mirrors compiler.ts)
// ---------------------------------------------------------------------------

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
  return {
    binary: {
      [get(OPERATOR_EQ)]: OP_EQ,
      [get(OPERATOR_NE)]: OP_NE,
      [get(OPERATOR_GT)]: OP_GT,
      [get(OPERATOR_GE)]: OP_GE,
      [get(OPERATOR_LT)]: OP_LT,
      [get(OPERATOR_LE)]: OP_LE,
      [get(OPERATOR_IN)]: OP_IN,
      [get(OPERATOR_NOT_IN)]: OP_NOT_IN,
      [get(OPERATOR_PREFIX)]: OP_PREFIX,
      [get(OPERATOR_SUFFIX)]: OP_SUFFIX,
      [get(OPERATOR_OVERLAP)]: OP_OVERLAP,
    },
    arithmetic: {
      [get(OPERATOR_SUM)]: OP_SUM,
      [get(OPERATOR_SUBTRACT)]: OP_SUBTRACT,
      [get(OPERATOR_MULTIPLY)]: OP_MULTIPLY,
      [get(OPERATOR_DIVIDE)]: OP_DIVIDE,
    },
    presentOp: get(OPERATOR_PRESENT),
    undefinedOp: get(OPERATOR_UNDEFINED),
    andOp: get(OPERATOR_AND),
    orOp: get(OPERATOR_OR),
    norOp: get(OPERATOR_NOR),
    notOp: get(OPERATOR_NOT),
    xorOp: get(OPERATOR_XOR),
    inOp: get(OPERATOR_IN),
    notInOp: get(OPERATOR_NOT_IN),
    overlapOp: get(OPERATOR_OVERLAP),
    eqOp: get(OPERATOR_EQ),
  }
}

function isStaticCollection(raw: Input, opts: Options): raw is Input[] {
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

function getFirstCtxKey(ref: CompactRef): string | undefined {
  if (typeof ref === 'string') {
    return undefined
  }
  if (Array.isArray(ref)) {
    return ref[0]
  }
  if (ref.d) {
    return undefined
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

function internConst(items: Input[], state: CompilerState): number {
  const key = JSON.stringify(items)
  let idx = state.constIndex.get(key)
  if (idx === undefined) {
    idx = state.consts.length
    state.consts.push(items)
    state.constIndex.set(key, idx)
  }
  return idx
}

function emitOperand(raw: Input, state: CompilerState): void {
  const { bytecode, refs, opts } = state

  if (Array.isArray(raw)) {
    const hasDynamic = raw.some(
      (v) => typeof v === 'string' && opts.referencePredicate(v)
    )

    if (hasDynamic) {
      const cseKey = JSON.stringify(raw)
      const existingSlot = state.collectionCse.get(cseKey)
      if (existingSlot !== undefined) {
        bytecode.push(OP_LOAD_LOCAL, existingSlot)
        return
      }
      for (const item of raw) {
        emitOperand(item, state)
      }
      bytecode.push(OP_MAKE_COLLECTION, raw.length)
      const slot = state.collectionCse.size
      state.collectionCse.set(cseKey, slot)
      bytecode.push(OP_STORE_LOCAL, slot)
      return
    }

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

function emitShortCircuit(
  arr: Input[],
  jumpOp: typeof OP_JUMP_IF_FALSE | typeof OP_JUMP_IF_TRUE,
  markerOp: typeof OP_AND | typeof OP_OR | typeof OP_NOR,
  state: CompilerState
): void {
  const { bytecode } = state
  const jumpSlots: number[] = []
  const last = arr.length - 1

  for (let i = 1; i < last; i++) {
    emitExpression(arr[i], state)
    bytecode.push(jumpOp)
    jumpSlots.push(bytecode.length)
    bytecode.push(0)
    bytecode.push(OP_POP)
  }

  emitExpression(arr[last], state)
  const end = bytecode.length
  for (const slot of jumpSlots) {
    bytecode[slot] = end - slot - 1
  }
  bytecode.push(markerOp, last)
}

function emitExpression(raw: Input, state: CompilerState): void {
  const { bytecode, maps } = state

  if (!Array.isArray(raw)) {
    emitOperand(raw, state)
    return
  }

  const arr = raw
  const operator = arr[0]
  const nOperands = arr.length - 1

  if (typeof operator !== 'string') {
    emitOperand(raw, state)
    return
  }

  // Logical
  if (operator === maps.andOp) {
    emitShortCircuit(arr, OP_JUMP_IF_FALSE, OP_AND, state)
    return
  }
  if (operator === maps.orOp) {
    emitShortCircuit(arr, OP_JUMP_IF_TRUE, OP_OR, state)
    return
  }
  if (operator === maps.norOp) {
    emitShortCircuit(arr, OP_JUMP_IF_TRUE, OP_NOR, state)
    bytecode.push(OP_NOT)
    return
  }
  if (operator === maps.notOp) {
    emitExpression(arr[1], state)
    bytecode.push(OP_NOT)
    return
  }
  if (operator === maps.xorOp) {
    emitExpression(arr[1], state)
    for (let i = 2; i <= nOperands; i++) {
      emitExpression(arr[i], state)
      bytecode.push(OP_XOR)
    }
    return
  }

  // Containment IN / NOT_IN
  if (operator === maps.inOp || operator === maps.notInOp) {
    const left = arr[1],
      right = arr[2]
    if (Array.isArray(left) && !Array.isArray(right)) {
      const leftArr: Input[] = left
      const leftHasDynamic = leftArr.some(
        (v) => typeof v === 'string' && state.opts.referencePredicate(v)
      )
      const constOp = operator === maps.inOp ? OP_IN_CONST : OP_NOT_IN_CONST
      const collectionOp =
        operator === maps.inOp ? OP_IN_COLLECTION : OP_NOT_IN_COLLECTION
      if (!leftHasDynamic) {
        emitExpression(right, state)
        const pos = bytecode.length
        bytecode.push(constOp, internConst(leftArr, state))
        state.directionEntries.push({ pos, dir: 0 })
      } else if (
        isPureRefCollection(leftArr, state.opts) &&
        !(typeof right === 'string' && state.opts.referencePredicate(right))
      ) {
        const scanOp =
          operator === maps.inOp
            ? OP_IN_SCAN_REFS_CONST
            : OP_NOT_IN_SCAN_REFS_CONST
        const constIdx = internConst([right], state)
        const pos = bytecode.length
        const refIdxs: number[] = []
        bytecode.push(scanOp, leftArr.length)
        for (const item of leftArr) {
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos, dir: 0 })
        state.overlapRefsEntries.push({ pos, refIdxs })
      } else {
        for (const item of leftArr) {
          emitOperand(item, state)
        }
        emitExpression(right, state)
        const pos = bytecode.length
        bytecode.push(collectionOp, leftArr.length)
        state.directionEntries.push({ pos, dir: 0 })
      }
      return
    }
    if (Array.isArray(right) && !Array.isArray(left)) {
      const rightArr: Input[] = right
      const rightHasDynamic = rightArr.some(
        (v) => typeof v === 'string' && state.opts.referencePredicate(v)
      )
      const constOp = operator === maps.inOp ? OP_IN_CONST : OP_NOT_IN_CONST
      const collectionOp =
        operator === maps.inOp ? OP_IN_COLLECTION : OP_NOT_IN_COLLECTION
      if (!rightHasDynamic) {
        emitExpression(left, state)
        const pos = bytecode.length
        bytecode.push(constOp, internConst(rightArr, state))
        state.directionEntries.push({ pos, dir: 1 })
      } else if (
        isPureRefCollection(rightArr, state.opts) &&
        !(typeof left === 'string' && state.opts.referencePredicate(left))
      ) {
        const scanOp =
          operator === maps.inOp
            ? OP_IN_SCAN_REFS_CONST
            : OP_NOT_IN_SCAN_REFS_CONST
        const constIdx = internConst([left], state)
        const pos = bytecode.length
        const refIdxs: number[] = []
        bytecode.push(scanOp, rightArr.length)
        for (const item of rightArr) {
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos, dir: 1 })
        state.overlapRefsEntries.push({ pos, refIdxs })
      } else {
        for (const item of rightArr) {
          emitOperand(item, state)
        }
        emitExpression(left, state)
        const pos = bytecode.length
        bytecode.push(collectionOp, rightArr.length)
        state.directionEntries.push({ pos, dir: 1 })
      }
      return
    }
  }

  // OVERLAP
  if (operator === maps.overlapOp) {
    const left = arr[1],
      right = arr[2]
    if (
      isStaticCollection(left, state.opts) &&
      !isStaticCollection(right, state.opts)
    ) {
      const constIdx = internConst(left, state)
      if (isPureRefCollection(right, state.opts)) {
        const pos = bytecode.length
        bytecode.push(OP_OVERLAP_SCAN_REFS_CONST, right.length)
        const refIdxs: number[] = []
        for (const item of right) {
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos, dir: 0 })
        state.overlapRefsEntries.push({ pos, refIdxs })
      } else {
        emitExpression(right, state)
        const pos = bytecode.length
        bytecode.push(OP_OVERLAP_CONST, constIdx)
        state.directionEntries.push({ pos, dir: 0 })
      }
      return
    }
    if (
      isStaticCollection(right, state.opts) &&
      !isStaticCollection(left, state.opts)
    ) {
      const constIdx = internConst(right, state)
      if (isPureRefCollection(left, state.opts)) {
        const pos = bytecode.length
        bytecode.push(OP_OVERLAP_SCAN_REFS_CONST, left.length)
        const refIdxs: number[] = []
        for (const item of left) {
          const refIdx = internRef(item, state)
          bytecode.push(refIdx)
          refIdxs.push(refIdx)
        }
        bytecode.push(constIdx)
        state.directionEntries.push({ pos, dir: 1 })
        state.overlapRefsEntries.push({ pos, refIdxs })
      } else {
        emitExpression(left, state)
        const pos = bytecode.length
        bytecode.push(OP_OVERLAP_CONST, constIdx)
        state.directionEntries.push({ pos, dir: 1 })
      }
      return
    }
  }

  if (operator in maps.binary) {
    emitExpression(arr[1], state)
    emitExpression(arr[2], state)
    bytecode.push(maps.binary[operator])
    return
  }

  if (operator === maps.presentOp) {
    emitExpression(arr[1], state)
    bytecode.push(OP_PRESENT)
    return
  }
  if (operator === maps.undefinedOp) {
    emitExpression(arr[1], state)
    bytecode.push(OP_UNDEFINED)
    return
  }

  if (operator in maps.arithmetic) {
    for (let i = 1; i <= nOperands; i++) {
      emitExpression(arr[i], state)
    }
    bytecode.push(maps.arithmetic[operator], nOperands)
    return
  }

  emitOperand(raw, state)
}

// ---------------------------------------------------------------------------
// compileBatch — main entry point
// ---------------------------------------------------------------------------

/**
 * Compile a map of expressions into a single CompiledBatch.
 *
 * Phase 1: Collect all refs and consts into shared maps, build dependency graph.
 * Phase 2: Compile each expression with shared state, assign localsBase offsets.
 * Phase 3: Build sharedConstSets.
 */
export function compileBatch(
  expressions: Map<string, ExpressionInput>,
  opts: Options
): CompiledBatch {
  const maps = buildOperatorMaps(opts)

  // Phase 1: Collect all refs and consts into shared maps
  const sharedRefs: CompactRef[] = []
  const sharedRefIndex = new Map<string, number>()
  const sharedRefRawKeys: string[] = []
  const sharedRefKeys: string[] = []
  const sharedConsts: Input[][] = []
  const sharedConstIndex = new Map<string, number>()

  // First pass: collect all refs (for dependency graph and deduplication)
  for (const [, raw] of expressions) {
    collectAllRefs(
      raw,
      sharedRefIndex,
      sharedRefs,
      sharedRefRawKeys,
      sharedRefKeys,
      opts
    )
  }

  // Build dependency graph
  const dependencyGraph = buildDependencyGraph(
    expressions,
    sharedRefs,
    sharedRefKeys,
    opts
  )

  // Phase 2: Compile each expression with shared state
  const batchExpressions = new Map<string, CompiledBatchExpression>()

  // Build opNames map once — same for all expressions
  const opNames: Record<number, string> = {}
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

  for (const [exprName, raw] of expressions) {
    const exprState: CompilerState = {
      bytecode: [],
      refs: sharedRefs,
      refIndex: sharedRefIndex,
      refRawKeys: sharedRefRawKeys,
      refKeys: sharedRefKeys,
      opts,
      maps,
      collectionCse: new Map(),
      consts: sharedConsts,
      constIndex: sharedConstIndex,
      overlapRefsEntries: [],
      directionEntries: [],
    }

    emitExpression(raw, exprState)

    // Pre-build residual arrays
    const overlapRefsResiduals: Array<[number, Input[]]> =
      exprState.overlapRefsEntries.map(({ pos, refIdxs }) => [
        pos,
        refIdxs.map((idx) => sharedRefKeys[idx]),
      ])

    const directionMap: Array<[number, 0 | 1]> = exprState.directionEntries.map(
      ({ pos, dir }) => [pos, dir]
    )

    // Extract ref indices and const indices from bytecode
    const refIndices = extractRefIndices(exprState.bytecode)
    const constIndices = extractConstIndices(exprState.bytecode)

    batchExpressions.set(exprName, {
      bytecode: exprState.bytecode,
      refs: refIndices,
      consts: constIndices,
      overlapRefsResiduals,
      directionMap,
      refFirstCtxKeys: sharedRefs.map(getFirstCtxKey),
      dirty: false,
      precompiled: {
        bytecode: exprState.bytecode,
        refs: sharedRefs,
        consts: sharedConsts,
        opNames,
        refKeys: sharedRefKeys,
        refRawKeys: sharedRefRawKeys,
        overlapRefsResiduals,
        directionMap,
        refFirstCtxKeys: sharedRefs.map(getFirstCtxKey),
      },
    })
  }

  // Phase 3: sharedConstSets — empty, built lazily in interpreter
  const sharedConstSets: Set<Result>[] = []

  return {
    expressions: batchExpressions,
    sharedRefs,
    sharedConsts,
    sharedConstSets,
    opNames,
    dependencyGraph,
  }
}

/**
 * Recursively collect all refs from an expression tree.
 */
function collectAllRefs(
  input: Input,
  sharedRefIndex: Map<string, number>,
  sharedRefs: CompactRef[],
  sharedRefRawKeys: string[],
  sharedRefKeys: string[],
  opts: Options
): void {
  if (Array.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      collectAllRefs(
        input[i],
        sharedRefIndex,
        sharedRefs,
        sharedRefRawKeys,
        sharedRefKeys,
        opts
      )
    }
  } else if (typeof input === 'string' && opts.referencePredicate(input)) {
    const transformed = opts.referenceTransform(input)
    if (!sharedRefIndex.has(transformed)) {
      const idx = sharedRefs.length
      sharedRefs.push(buildCompactRef(transformed))
      sharedRefIndex.set(transformed, idx)
      sharedRefRawKeys.push(transformed)
      sharedRefKeys.push(input)
    }
  }
}

/**
 * Safely extract a number from bytecode at a given index.
 */
function bcNum(bc: Bytecode, i: number): number {
  const v = bc[i]
  if (typeof v !== 'number') {
    return 0 // Return 0 for non-number values (e.g., string constants)
  }
  return v
}

/**
 * Extract ref indices from bytecode by scanning for ref opcode operands.
 */
function extractRefIndices(bytecode: Bytecode): number[] {
  const indices = new Set<number>()
  let i = 0
  while (i < bytecode.length) {
    const op = bytecode[i]
    if (typeof op !== 'number') {
      i++
      continue
    }

    switch (op) {
      case OP_PUSH_REF_KEY:
      case OP_PUSH_REF_KEYS:
      case OP_PUSH_REF_TOKENS:
      case OP_PUSH_REF_DYNAMIC:
        i++
        indices.add(bcNum(bytecode, i))
        break
      case OP_IN_SCAN_REFS_CONST:
      case OP_NOT_IN_SCAN_REFS_CONST: {
        const n = bcNum(bytecode, ++i)
        i += n
        i++ // skip constIdx
        break
      }
      case OP_OVERLAP_SCAN_REFS_CONST: {
        const n = bcNum(bytecode, ++i)
        i += n
        i++ // skip constIdx
        break
      }
      case OP_OR_AND_IN_CONST_2: {
        i += 3 // ref1Idx, ref2Idx, M
        i++
        const m = bcNum(bytecode, i)
        i += m * 2
        break
      }
      default:
        i++
    }
  }
  return Array.from(indices)
}

/**
 * Extract const indices from bytecode by scanning for const opcode operands.
 */
function extractConstIndices(bytecode: Bytecode): number[] {
  const indices = new Set<number>()
  let i = 0
  while (i < bytecode.length) {
    const op = bytecode[i]
    if (typeof op !== 'number') {
      i++
      continue
    }

    switch (op) {
      case OP_PUSH_CONST:
        i++
        indices.add(bcNum(bytecode, i))
        break
      case OP_IN_CONST:
      case OP_NOT_IN_CONST:
      case OP_OVERLAP_CONST:
        i++
        indices.add(bcNum(bytecode, i))
        break
      case OP_IN_SCAN_REFS_CONST:
      case OP_NOT_IN_SCAN_REFS_CONST:
      case OP_OVERLAP_SCAN_REFS_CONST: {
        const n = bcNum(bytecode, ++i)
        i += n
        indices.add(bcNum(bytecode, i))
        break
      }
      case OP_OR_AND_IN_CONST_2: {
        i += 3 // ref1Idx, ref2Idx, M
        i++
        const m = bcNum(bytecode, i)
        for (let j = 0; j < m; j++) {
          i += 2
          indices.add(bcNum(bytecode, i))
        }
        break
      }
      default:
        i++
    }
  }
  return Array.from(indices)
}
