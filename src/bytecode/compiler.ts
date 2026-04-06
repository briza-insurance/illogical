/**
 * Bytecode compiler.
 *
 * Transforms a raw ExpressionInput (plain array) into a flat Bytecode array
 * that the interpreter can execute. This runs once per unique expression;
 * the result should be cached and reused across evaluate() calls.
 */

import { Result } from '../common/evaluable.js'
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
  OP_DIVIDE,
  OP_EQ,
  OP_GE,
  OP_GT,
  OP_IN,
  OP_IN_COLLECTION,
  OP_IN_CONST,
  OP_JUMP_IF_FALSE,
  OP_JUMP_IF_TRUE,
  OP_LE,
  OP_LOAD_LOCAL,
  OP_LT,
  OP_MAKE_COLLECTION,
  OP_MULTIPLY,
  OP_NE,
  OP_NOT,
  OP_NOT_IN,
  OP_NOT_IN_COLLECTION,
  OP_NOT_IN_CONST,
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
import { buildCompactRef, CompactRef } from './refs.js'

// Bytecode is a flat array of numbers (opcodes and index operands) interspersed
// with literal Result values (for OP_PUSH_VALUE).
export type Bytecode = (number | Result)[]

// Lookup tables built once per Options instance — operator string → opcode.
// Stored outside emitExpression so they are not recreated on every compile call.
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

interface CompilerState {
  bytecode: Bytecode
  refs: CompactRef[] // side-table of compact refs, indexed by position
  refIndex: Map<string, number> // dedup map: raw key → index into refs
  opts: Options
  maps: OperatorMaps
  // CSE: canonical key → local slot index for dynamic collections seen >1 time
  collectionCse: Map<string, number>
  numLocals: number
  // Static collection constants table — interned by JSON key, zero allocation at runtime
  consts: ArrayInput[]
  constIndex: Map<string, number>
}

function isStaticCollection(raw: Input, opts: Options): raw is ArrayInput {
  return (
    Array.isArray(raw) &&
    !raw.some((v) => typeof v === 'string' && opts.referencePredicate(v))
  )
}

function isPureRefCollection(raw: Input, opts: Options): raw is ArrayInput {
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
  }
  return refIndex
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
    const key = opts.referenceTransform(raw)
    let refIndex = state.refIndex.get(key)
    if (refIndex === undefined) {
      refIndex = refs.length
      const ref = buildCompactRef(key)
      refs.push(ref)
      state.refIndex.set(key, refIndex)
      bytecode.push(refOpcode(ref), refIndex)
    } else {
      bytecode.push(refOpcode(refs[refIndex]), refIndex)
    }
    return
  }

  bytecode.push(OP_PUSH_VALUE, raw)
}

/**
 * Return the ref key and static value array for a branch child that is either:
 *   IN(ref, [v1, v2, ...])  — ref ∈ static collection
 *   ==(ref, scalar)         — ref === scalar, treated as IN with [scalar]
 * Returns null if the child does not match either form.
 */
function extractInLikeChild(
  ca: ArrayInput,
  state: CompilerState
): { rawRef: string; refKey: string; vals: ArrayInput } | null {
  const op = ca[0]
  const left = ca[1]
  if (typeof left !== 'string' || !state.opts.referencePredicate(left)) {
    return null
  }
  // left is narrowed to string by the guard above
  const rawRef = left
  const refKey = state.opts.referenceTransform(rawRef)

  if (op === state.maps.inOp) {
    const right = ca[2]
    if (!isStaticCollection(right, state.opts)) {
      return null
    }
    return { rawRef, refKey, vals: right }
  }

  // == (EQ): scalar equality treated as single-element IN
  if (op === state.maps.eqOp) {
    const right = ca[2]
    if (typeof right === 'string' && state.opts.referencePredicate(right)) {
      return null
    }
    if (Array.isArray(right)) {
      return null
    }
    return { rawRef, refKey, vals: [right] }
  }

  return null
}

/**
 * Check whether an OR expression matches the pattern:
 *   OR( AND(IN-like(ref1, set1), IN-like(ref2, set2)), ... )
 * where IN-like is either IN(ref, staticSet) or ==(ref, scalar),
 * and every branch uses the exact same two refs in the same order.
 * Returns [ref1Key, ref2Key] if the pattern matches, null otherwise.
 */
function detectOrAndIn2Pattern(
  arr: ArrayInput,
  state: CompilerState
): [string, string] | null {
  const nBranches = arr.length - 1
  if (nBranches < 2) {
    return null
  }

  let rawRef1: string | null = null
  let rawRef2: string | null = null
  let refKey1: string | null = null
  let refKey2: string | null = null

  for (let b = 1; b <= nBranches; b++) {
    const branch = arr[b]
    if (!Array.isArray(branch)) {
      return null
    }
    if (branch[0] !== state.maps.andOp) {
      return null
    }
    if (branch.length !== 3) {
      return null
    } // exactly 2 children

    for (let c = 1; c <= 2; c++) {
      const child = branch[c]
      if (!Array.isArray(child)) {
        return null
      }
      const extracted = extractInLikeChild(child, state)
      if (extracted === null) {
        return null
      }
      const { rawRef, refKey } = extracted
      if (b === 1) {
        if (c === 1) {
          rawRef1 = rawRef
          refKey1 = refKey
        } else {
          rawRef2 = rawRef
          refKey2 = refKey
        }
      } else {
        if (c === 1 && refKey !== refKey1) {
          return null
        }
        if (c === 2 && refKey !== refKey2) {
          return null
        }
      }
    }
  }

  if (rawRef1 === null || rawRef2 === null) {
    return null
  }
  return [rawRef1, rawRef2]
}

// arr[0] is the operator; operands are arr[1..arr.length-1]
function emitShortCircuit(
  arr: ArrayInput,
  jumpOp: typeof OP_JUMP_IF_FALSE | typeof OP_JUMP_IF_TRUE,
  state: CompilerState
): void {
  const { bytecode } = state
  const jumpSlots: number[] = []
  const last = arr.length - 1

  for (let i = 1; i < last; i++) {
    emitExpression(arr[i], state)
    bytecode.push(jumpOp)
    jumpSlots.push(bytecode.length)
    bytecode.push(0) // placeholder — backpatched below
    bytecode.push(OP_POP) // discard result before evaluating next operand
  }

  emitExpression(arr[last], state)

  const end = bytecode.length
  for (const slot of jumpSlots) {
    bytecode[slot] = end - slot - 1
  }
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

  // ---------------------------------------------------------------------------
  // Logical — short-circuit with jump instructions
  // ---------------------------------------------------------------------------
  if (operator === maps.andOp) {
    emitShortCircuit(arr, OP_JUMP_IF_FALSE, state)
    return
  }

  if (operator === maps.orOp) {
    const orAnd2 = detectOrAndIn2Pattern(arr, state)
    if (orAnd2 !== null) {
      const [ref1Key, ref2Key] = orAnd2
      const { bytecode } = state
      const nBranches = arr.length - 1
      const ref1Idx = internRef(ref1Key, state)
      const ref2Idx = internRef(ref2Key, state)
      bytecode.push(OP_OR_AND_IN_CONST_2, ref1Idx, ref2Idx, nBranches)
      for (let b = 1; b <= nBranches; b++) {
        const branch = arr[b]
        if (!Array.isArray(branch)) {
          throw new Error('OR-AND-IN-2 pattern: expected array branch')
        }
        const child1 = branch[1]
        const child2 = branch[2]
        if (!Array.isArray(child1) || !Array.isArray(child2)) {
          throw new Error('OR-AND-IN-2 pattern: expected array children')
        }
        const extractedA = extractInLikeChild(child1, state)
        const extractedB = extractInLikeChild(child2, state)
        if (extractedA === null || extractedB === null) {
          throw new Error(
            'OR-AND-IN-2 pattern: failed to extract IN-like child'
          )
        }
        bytecode.push(
          internConst(extractedA.vals, state),
          internConst(extractedB.vals, state)
        )
      }
      return
    }
    emitShortCircuit(arr, OP_JUMP_IF_TRUE, state)
    return
  }

  if (operator === maps.norOp) {
    // NOR = NOT OR: emit as OR with short-circuit, then negate
    emitShortCircuit(arr, OP_JUMP_IF_TRUE, state)
    bytecode.push(OP_NOT)
    return
  }

  if (operator === maps.notOp) {
    emitExpression(arr[1], state)
    bytecode.push(OP_NOT)
    return
  }

  if (operator === maps.xorOp) {
    // XOR is associative: chain binary XOR operations
    // (A XOR B) XOR C XOR D ...
    emitExpression(arr[1], state)
    for (let i = 2; i <= nOperands; i++) {
      emitExpression(arr[i], state)
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
        emitExpression(right, state)
        bytecode.push(constOp, internConst(leftArr, state))
      } else {
        // dynamic collection on left — inline stack scan
        for (const item of leftArr) {
          emitOperand(item, state)
        }
        emitExpression(right, state)
        bytecode.push(collectionOp, leftArr.length)
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
        emitExpression(left, state)
        bytecode.push(constOp, internConst(rightArr, state))
      } else {
        // dynamic collection on right — inline stack scan
        for (const item of rightArr) {
          emitOperand(item, state)
        }
        emitExpression(left, state)
        bytecode.push(collectionOp, rightArr.length)
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
        bytecode.push(OP_OVERLAP_SCAN_REFS_CONST, right.length)
        for (const item of right) {
          if (typeof item !== 'string') {
            throw new Error(
              'OVERLAP: expected string ref in pure-ref collection'
            )
          }
          bytecode.push(internRef(item, state))
        }
        bytecode.push(constIdx)
      } else {
        emitExpression(right, state)
        bytecode.push(OP_OVERLAP_CONST, constIdx)
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
        bytecode.push(OP_OVERLAP_SCAN_REFS_CONST, left.length)
        for (const item of left) {
          if (typeof item !== 'string') {
            throw new Error(
              'OVERLAP: expected string ref in pure-ref collection'
            )
          }
          bytecode.push(internRef(item, state))
        }
        bytecode.push(constIdx)
      } else {
        emitExpression(left, state)
        bytecode.push(OP_OVERLAP_CONST, constIdx)
      }
      return
    }
    // Both static or both dynamic: fall through to generic OP_OVERLAP
  }

  if (operator in maps.binary) {
    emitExpression(arr[1], state)
    emitExpression(arr[2], state)
    bytecode.push(maps.binary[operator])
    return
  }

  // ---------------------------------------------------------------------------
  // Unary comparison
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Arithmetic — N operands
  // ---------------------------------------------------------------------------
  if (operator in maps.arithmetic) {
    for (let i = 1; i <= nOperands; i++) {
      emitExpression(arr[i], state)
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
}

/**
 * Compile a raw ExpressionInput into bytecode.
 * The result should be cached and reused across evaluate() calls.
 */
export function compile(
  raw: ExpressionInput,
  opts: Options
): CompiledExpression {
  const state: CompilerState = {
    bytecode: [],
    refs: [],
    refIndex: new Map(),
    opts,
    maps: buildOperatorMaps(opts),
    collectionCse: new Map(),
    numLocals: 0,
    consts: [],
    constIndex: new Map(),
  }
  emitExpression(raw, state)
  return {
    bytecode: state.bytecode,
    refs: state.refs,
    numLocals: state.numLocals,
    consts: state.consts,
  }
}
