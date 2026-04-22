/**
 * Bytecode simplify interpreter.
 *
 * Runs the same bytecode as the evaluate interpreter but supports partial
 * evaluation. Stack slots hold either a Result (fully resolved) or an Input
 * fragment (residual — a ref string or a sub-expression array). When an
 * operator receives any residual operand it reconstructs the sub-expression
 * as an Input array instead of computing a value.
 *
 * Short-circuit logic still applies: AND with a false short-circuits even if
 * other operands are unknown; OR with a true short-circuits likewise.
 */

import { Context, Result } from '../common/evaluable.js'
import { isNumber, isString } from '../common/type-check.js'
import { toDateNumber } from '../common/util.js'
import { Input } from '../parser/index.js'
import { CompiledExpression } from './compiler.js'
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
} from './opcodes.js'
import { operateWithExpectedDecimals } from './operateWithExpectedDecimals.js'
import { resolveCompactRef } from './refs.js'

const addDecimals = operateWithExpectedDecimals('sum')
const subtractDecimals = operateWithExpectedDecimals('subtract')
const multiplyDecimals = operateWithExpectedDecimals('multiply')
const divideDecimals = (a: number, b: number): number => a / b

// WeakMap Set cache for OP_OVERLAP_CONST, OP_OVERLAP_SCAN_REFS_CONST, and OP_IN_CONST —
// same pattern as the evaluate interpreter.
// Keyed on the const array identity so Sets are released when the CompiledExpression is GC'd.
const overlapSetCache = new WeakMap<Result[], Set<Result>>()

// Per-compiled-expression Map caches — built lazily from the serializable tuple arrays on the
// CompiledExpression. Same WeakMap pattern as constSetsCache in the evaluate interpreter so
// the Maps are released when the CompiledExpression is GC'd.
const overlapRefsResidualsCache = new WeakMap<
  CompiledExpression,
  Map<number, Input[]>
>()
const directionMapCache = new WeakMap<CompiledExpression, Map<number, 0 | 1>>()

// Read a numeric operand from a bytecode slot — opcodes and index operands are always numbers.
// Throws if the slot contains a non-number (guards against compiler bugs).
function numAt(v: number | Result): number {
  if (typeof v !== 'number') {
    throw new Error(
      `bytecode integrity error: expected number, got ${typeof v}`
    )
  }
  return v
}

// Read a literal value from a bytecode slot — stored literals are always string|number|boolean.
// Throws if the slot contains null, undefined, or an array (guards against compiler bugs).
// Returns string|number|boolean, which is a subtype of Input.
function literalAt(v: number | Result): string | number | boolean {
  if (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean'
  ) {
    return v
  }
  throw new Error(`bytecode integrity error: expected literal, got ${typeof v}`)
}

// Retrieve a required entry from a map — throws if the key is missing.
// Eliminates the Map.get() undefined return in contexts where the entry is compiler-guaranteed.
function requireMapEntry<K, V>(map: ReadonlyMap<K, V>, key: K): V {
  const v = map.get(key)
  if (v === undefined) {
    throw new Error(
      `bytecode integrity error: missing required map entry for key ${String(key)}`
    )
  }
  return v
}

// A resolved ref carries its computed value and original serialized form.
// Used so that when a comparison partially resolves, we reconstruct using
// the original ref key (e.g. '$a') rather than the resolved value (e.g. 10).
// Numeric tag _r used for all three wrapper types so V8 can use hidden-class
// fixed-offset reads instead of the slower `'key' in obj` property-existence check.
interface Resolved {
  readonly _r: 1
  val: Result
  src: string // serialized ref key, e.g. '$RefA'
}

// A residual sub-expression — a reconstructed Input fragment.
// Wrapped in an object so we can distinguish it from concrete Result[] arrays.
interface Residual {
  readonly _r: 2
  expr: Input // reconstructed expression (an Input array like ['EQ', '$ref', 5])
}

// Accumulated XOR state during chained binary XOR evaluation.
// Tracks residual operands and how many concrete-true values were seen.
interface XorState {
  readonly _r: 3
  xorResiduals: Input[]
  xorTrueCount: number
}

// Union of all slot object wrapper types (distinguishable via _r discriminant).
type SlotObject = Resolved | Residual | XorState

// Arrays on the stack carry no _r property. Declaring _r?: undefined here exposes
// the discriminant on the full "non-null object Slot" union so that needsReconstruct
// and slotVal can read ._r directly — without Array.isArray — in their hot paths.
// For arrays, ._r resolves to undefined, which naturally fails the === 2/3/1 checks.
type ArraySlot = Result[] & { readonly _r?: undefined }

// A stack slot is a concrete value (primitives, arrays, SlotObject wrappers).
// Record<string,unknown> context values are never pushed directly — they are always
// wrapped in a Resolved object — so the Slot type excludes them.
type Slot =
  | null
  | undefined
  | string
  | number
  | boolean
  | ArraySlot
  | SlotObject

function isXorState(v: Slot): v is XorState {
  return typeof v === 'object' && v !== null && v._r === 3
}

function isResidual(v: Slot): v is Residual {
  return typeof v === 'object' && v !== null && v._r === 2
}

// True if the slot is an unknown ref (string starting with '$')
function isUnknownRef(v: Slot): boolean {
  return typeof v === 'string' && v.charCodeAt(0) === 36 // '$'
}

// True if the slot needs to be reconstructed rather than computed.
// Hot path — booleans/numbers short-circuit at the first typeof check.
// No Array.isArray needed: arrays have _r === undefined, failing the 2/3 check.
function needsReconstruct(v: Slot): boolean {
  if (typeof v === 'string') {
    return v.charCodeAt(0) === 36
  }
  if (typeof v !== 'object' || v === null) {
    return false
  }
  // v is ArraySlot | SlotObject; _r is undefined|1|2|3
  return v._r === 2 || v._r === 3
}

// Extract the concrete Result from a slot (unwrap Resolved if needed).
// Hot path — no Array.isArray needed: for non-Resolved objects (arrays, Residual,
// XorState), the _r === 1 check is false and they fall through to the primitive branch
// or return undefined as appropriate.
function slotVal(v: Slot): Result {
  if (typeof v !== 'object' || v === null) {
    return v // primitives: boolean, number, string, null, undefined
  }
  // v is ArraySlot | SlotObject
  if (v._r === 1) {
    return v.val // Resolved — unwrap the concrete value
  }
  if (v._r === undefined) {
    return v // ArraySlot — the array is itself a Result
  }
  return undefined // Residual or XorState — no concrete value to extract
}

// Module-level op name references for XorState finalization.
// Set at the start of each interpretSimplify call.
let _xorOpName = 'XOR'
let _notOpName = 'NOT'
let _norOpName = 'NOR'

// Type guard: checks whether a Result value is also a valid Input.
// Input = string | number | boolean | Input[], while Result additionally includes
// null, undefined, and Record<string,unknown>. Used to narrow in slotSrc.
function isInput(v: Result): v is Input {
  if (v === null || v === undefined) {
    return false
  }
  if (Array.isArray(v)) {
    return v.every(isInput)
  }
  return typeof v !== 'object' // excludes Record<string,unknown>
}

// Extract the serialized Input form of a slot for residual reconstruction.
function slotSrc(v: Slot): Input {
  if (typeof v !== 'object' || v === null) {
    // v is a primitive: undefined | null | string | number | boolean
    // In residual paths this should always be a valid Input — guard against null/undefined.
    if (!isInput(v)) {
      throw new Error(
        `slotSrc: invariant violated — non-Input value in residual path: ${typeof v}`
      )
    }
    return v // v narrowed to Input by the type guard above
  }
  // v is ArraySlot | SlotObject; discriminate via _r
  if (v._r === undefined) {
    // ArraySlot — a concrete collection used as an operand
    if (!isInput(v)) {
      throw new Error(
        `slotSrc: invariant violated — non-Input array in residual path`
      )
    }
    return v
  }
  if (v._r === 3) {
    // XorState — finalize accumulated XOR state into an expression
    const { xorResiduals: residuals, xorTrueCount: trueCount } = v
    // "One-hot" XOR: if more than one true was seen, result is false
    if (trueCount > 1) {
      return false
    }
    const effectiveTrueCount = trueCount % 2
    if (residuals.length === 1) {
      return effectiveTrueCount === 1
        ? [_notOpName, residuals[0]]
        : residuals[0]
    }
    return effectiveTrueCount === 1
      ? [_norOpName, ...residuals]
      : [_xorOpName, ...residuals]
  }
  if (v._r === 2) {
    return v.expr // Residual — return the reconstructed expression
  }
  return v.src // v._r === 1 (Resolved) — return original ref key
}

// Wrap a reconstructed expression as a Residual slot.
// expr should be an Input array (sub-expression) like ['EQ', '$ref', 5].
function makeResidual(expr: Input): Residual {
  return { _r: 2, expr }
}

// Create a Resolved slot wrapping a known ref value.
function makeResolved(val: Result, src: string): Resolved {
  return { _r: 1, val, src }
}

// Create a XorState slot accumulating XOR operands.
function makeXorState(xorResiduals: Input[], xorTrueCount: number): XorState {
  return { _r: 3, xorResiduals, xorTrueCount }
}

// Pre-allocated stack — same as evaluate interpreter
const MAX_STACK = 512
const stack: Slot[] = new Array(MAX_STACK)
let stackTop = -1

// Pre-allocated locals for CSE collection caching
const MAX_LOCALS = 64
const locals: Slot[] = new Array(MAX_LOCALS)

// Pre-resolved ref cache — populated lazily per interpretSimplify call.
// Indexed by ref index; avoids repeated resolveCompactRef() calls when the same
// ref appears in multiple opcodes (e.g. multiple OVERLAP_SCAN_REFS_CONST in one expression).
// resolvedRefDirty[i] = true means resolvedRefCache[i] holds a valid (possibly undefined) result.
const MAX_REFS = 512
const resolvedRefCache: Result[] = new Array(MAX_REFS)
const resolvedRefDirty: boolean[] = new Array(MAX_REFS).fill(false)
// Tracks which indices were populated this call so we can reset only those.
const resolvedRefUsed: number[] = new Array(MAX_REFS)
let resolvedRefUsedCount = 0

// Residual spill buffer: when OP_POP discards a residual/unknown-ref slot that
// is part of a short-circuit AND/OR sequence, we save it here so OP_AND/OR/NOR
// can include it in the reconstructed expression.
const spillBuf: Slot[] = new Array(MAX_STACK)
let spillTop = -1
// Track the last jump opcode type to detect transitions between short-circuit
// sequences. Different jump opcodes (41=JUMP_IF_FALSE vs 42=JUMP_IF_TRUE) indicate
// different short-circuit sequences (AND vs OR/NOR).
let lastJumpOp = 0

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
): number {
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

export function interpretSimplify(
  compiled: CompiledExpression,
  ctx: Context,
  strictKeys?: string[] | Set<string>,
  optionalKeys?: string[] | Set<string>
): Input {
  const { bytecode, refs, opNames, refKeys, refRawKeys, refFirstCtxKeys } =
    compiled
  stackTop = -1
  spillTop = -1
  lastJumpOp = 0

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

  // Reset the ref cache (only clear slots used in the previous call)
  for (let r = 0; r < resolvedRefUsedCount; r++) {
    resolvedRefDirty[resolvedRefUsed[r]] = false
  }
  resolvedRefUsedCount = 0

  // Set module-level op names for XorState finalization
  _xorOpName = opNames[OP_XOR] ?? 'XOR'
  _notOpName = opNames[OP_NOT] ?? 'NOT'
  _norOpName = opNames[OP_NOR] ?? 'NOR'
  let i = 0
  const len = bytecode.length

  // Normalise key sets for O(1) lookup
  const strictSet =
    strictKeys instanceof Set
      ? strictKeys
      : strictKeys
        ? new Set(strictKeys)
        : undefined
  const optionalSet =
    optionalKeys instanceof Set
      ? optionalKeys
      : optionalKeys
        ? new Set(optionalKeys)
        : undefined

  while (i < len) {
    const op = numAt(bytecode[i++])

    switch (op) {
      // ---------------------------------------------------------------------
      // Push
      // ---------------------------------------------------------------------
      case OP_PUSH_VALUE: {
        const lit = bytecode[i++]
        // OP_PUSH_VALUE stores only literals (string/number/boolean/null/array) from
        // parsed Input — never plain objects. Guard lets TypeScript narrow away Record.
        if (typeof lit === 'object' && lit !== null && !Array.isArray(lit)) {
          throw new Error(
            `bytecode integrity error: unexpected object in OP_PUSH_VALUE`
          )
        }
        stack[++stackTop] = lit
        break
      }

      case OP_PUSH_REF_KEY:
      case OP_PUSH_REF_KEYS:
      case OP_PUSH_REF_TOKENS:
      case OP_PUSH_REF_DYNAMIC: {
        const idx = numAt(bytecode[i++])
        const rawKey = refRawKeys[idx]

        let val: Result
        if (resolvedRefDirty[idx]) {
          val = resolvedRefCache[idx]
        } else {
          val = resolveCompactRef(refs[idx], ctx)
          resolvedRefCache[idx] = val
          resolvedRefDirty[idx] = true
          resolvedRefUsed[resolvedRefUsedCount++] = idx
        }

        if (val !== undefined) {
          // Ref is in context — always resolve (strictKeys/optionalKeys only affect absent keys)
          stack[++stackTop] = makeResolved(val, refKeys[idx])
          break
        }

        // Ref is absent from context.
        // Check if it should be treated as a concrete undefined (evaluated as undefined)
        // or as a residual expression (preserved for later simplification).
        if (strictSet?.has(rawKey)) {
          // strictKeys: force-evaluate as undefined (not a residual)
          stack[++stackTop] = undefined
          break
        }

        if (optionalSet && !optionalSet.has(rawKey)) {
          // Key not in optionalKeys: treat as definitely-present but absent → undefined
          stack[++stackTop] = undefined
          break
        }

        // First-key heuristic: match OOP Reference.simplify() behavior.
        // If the top-level context key exists, the ref's parent object is known — treat the
        // (absent) sub-field as concrete undefined rather than preserving it as an unknown.
        // This only applies to multi-key refs (refFirstCtxKeys[idx] is undefined for single-key).
        const firstCtxKey = refFirstCtxKeys[idx]
        if (firstCtxKey !== undefined && ctx[firstCtxKey] !== undefined) {
          stack[++stackTop] = undefined
          break
        }

        // Key is genuinely unknown — push as residual ref string
        stack[++stackTop] = refKeys[idx]
        break
      }

      case OP_MAKE_COLLECTION: {
        const n = numAt(bytecode[i++])
        // Check for unknown items first
        let hasUnknown = false
        for (let j = 0; j < n; j++) {
          if (needsReconstruct(stack[stackTop - j])) {
            hasUnknown = true
            break
          }
        }
        if (hasUnknown) {
          // Keep serialized form (ref keys or sub-expressions) for residual reconstruction
          const items: Input[] = new Array(n)
          for (let j = n - 1; j >= 0; j--) {
            items[j] = slotSrc(stack[stackTop--])
          }
          stack[++stackTop] = makeResidual(items)
        } else {
          // All concrete — use actual values
          const items: Result[] = new Array(n)
          for (let j = n - 1; j >= 0; j--) {
            items[j] = slotVal(stack[stackTop--])
          }
          stack[++stackTop] = items
        }
        break
      }

      case OP_PUSH_CONST:
        stack[++stackTop] = compiled.consts[numAt(bytecode[i++])]
        break

      case OP_OVERLAP_CONST: {
        const opcodePos = i - 1 // position of OP_OVERLAP_CONST in bytecode
        const constArr = compiled.consts[numAt(bytecode[i++])]
        const constOnLeft = directionMap.get(opcodePos) === 0
        const dynamic = stack[stackTop--]
        if (needsReconstruct(dynamic)) {
          // Dynamic side is unknown — reconstruct as OVERLAP expression preserving original order
          const constInput: Input = constArr
          const dynamicInput = slotSrc(dynamic)
          stack[++stackTop] = makeResidual([
            opNames[OP_OVERLAP],
            constOnLeft ? constInput : dynamicInput,
            constOnLeft ? dynamicInput : constInput,
          ])
          break
        }
        const dynamicVal = slotVal(dynamic)
        if (
          dynamicVal === null ||
          dynamicVal === undefined ||
          !Array.isArray(dynamicVal)
        ) {
          stack[++stackTop] = false
          break
        }
        if (constArr.length === 0 && dynamicVal.length === 0) {
          stack[++stackTop] = true
          break
        }
        let found = false
        if (constArr.length === 1) {
          const constVal = constArr[0]
          for (let j = 0; j < dynamicVal.length; j++) {
            if (dynamicVal[j] === constVal) {
              found = true
              break
            }
          }
        } else {
          let s = overlapSetCache.get(constArr)
          if (s === undefined) {
            s = new Set<Result>(constArr)
            overlapSetCache.set(constArr, s)
          }
          for (let j = 0; j < dynamicVal.length; j++) {
            if (s.has(dynamicVal[j])) {
              found = true
              break
            }
          }
        }
        stack[++stackTop] = found
        break
      }

      case OP_OVERLAP_SCAN_REFS_CONST: {
        // bytecode layout: N, ref0..refN-1, constIdx
        const opcodePos = i - 1 // position of OP_OVERLAP_SCAN_REFS_CONST in bytecode
        const n = numAt(bytecode[i++])
        const refStart = i
        i += n // advance past all ref indices
        const constIdx = numAt(bytecode[i++])
        const constArr = compiled.consts[constIdx]
        const constOnLeft = directionMap.get(opcodePos) === 0

        // First pass: check whether any ref is genuinely unknown.
        // Uses the per-call ref cache to avoid redundant resolveCompactRef calls.
        let hasUnknown = false
        for (let j = 0; j < n; j++) {
          const refIdx = numAt(bytecode[refStart + j])
          const rawKey = refRawKeys[refIdx]
          let val: Result
          if (resolvedRefDirty[refIdx]) {
            val = resolvedRefCache[refIdx]
          } else {
            val = resolveCompactRef(refs[refIdx], ctx)
            resolvedRefCache[refIdx] = val
            resolvedRefDirty[refIdx] = true
            resolvedRefUsed[resolvedRefUsedCount++] = refIdx
          }
          if (val === undefined) {
            if (strictSet?.has(rawKey)) {
              continue
            }
            if (optionalSet && !optionalSet.has(rawKey)) {
              continue
            }
            // First-key heuristic: if parent object is in context, treat undefined sub-field as concrete
            const firstCtxKey = refFirstCtxKeys[refIdx]
            if (firstCtxKey !== undefined && ctx[firstCtxKey] !== undefined) {
              continue
            }
            hasUnknown = true
            break
          }
        }

        if (hasUnknown) {
          // Use pre-built residual array from compile time — no allocation here
          const refInputs = requireMapEntry(overlapRefsResiduals, opcodePos)
          const constInput: Input = constArr
          const dynamicInput: Input = refInputs
          stack[++stackTop] = makeResidual([
            opNames[OP_OVERLAP],
            constOnLeft ? constInput : dynamicInput,
            constOnLeft ? dynamicInput : constInput,
          ])
          break
        }

        let found = false
        if (constArr.length === 1) {
          // Fast path: single-element const — direct equality, no Set needed
          const constVal = constArr[0]
          for (let j = 0; j < n; j++) {
            const val = resolvedRefCache[numAt(bytecode[refStart + j])]
            if (val !== undefined && val === constVal) {
              found = true
              break
            }
          }
        } else {
          let s = overlapSetCache.get(constArr)
          if (s === undefined) {
            s = new Set<Result>(constArr)
            overlapSetCache.set(constArr, s)
          }
          for (let j = 0; j < n; j++) {
            const val = resolvedRefCache[numAt(bytecode[refStart + j])]
            if (val !== undefined && s.has(val)) {
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
        // bytecode layout: N, ref0..refN-1, constIdx
        // const at constIdx is a 1-element array [scalar]
        const opcodePos = i - 1
        const n = numAt(bytecode[i++])
        const refStart = i
        i += n
        const constIdx = numAt(bytecode[i++])
        const constArr = compiled.consts[constIdx]
        // dir=0: refs on left, scalar on right → scalar (constInput) is on right
        // dir=1: scalar on left, refs on right → scalar (constInput) is on left
        const constOnLeft = directionMap.get(opcodePos) === 1

        let hasUnknown = false
        for (let j = 0; j < n; j++) {
          const refIdx = numAt(bytecode[refStart + j])
          const rawKey = refRawKeys[refIdx]
          let val: Result
          if (resolvedRefDirty[refIdx]) {
            val = resolvedRefCache[refIdx]
          } else {
            val = resolveCompactRef(refs[refIdx], ctx)
            resolvedRefCache[refIdx] = val
            resolvedRefDirty[refIdx] = true
            resolvedRefUsed[resolvedRefUsedCount++] = refIdx
          }
          if (val === undefined) {
            if (strictSet?.has(rawKey)) {
              continue
            }
            if (optionalSet && !optionalSet.has(rawKey)) {
              continue
            }
            // First-key heuristic: if parent object is in context, treat undefined sub-field as concrete
            const firstCtxKey = refFirstCtxKeys[refIdx]
            if (firstCtxKey !== undefined && ctx[firstCtxKey] !== undefined) {
              continue
            }
            hasUnknown = true
            break
          }
        }

        if (hasUnknown) {
          const refInputs = requireMapEntry(overlapRefsResiduals, opcodePos)
          // constArr is a 1-element array [scalar]; use the scalar as the const operand
          const constInput: Input = constArr[0]
          const dynamicInput: Input = refInputs
          stack[++stackTop] = makeResidual([
            opNames[op],
            constOnLeft ? constInput : dynamicInput,
            constOnLeft ? dynamicInput : constInput,
          ])
          break
        }

        const target = constArr[0]
        let found = false
        if (target !== null && target !== undefined) {
          for (let j = 0; j < n; j++) {
            const val = resolvedRefCache[numAt(bytecode[refStart + j])]
            if (val === target) {
              found = true
              break
            }
          }
        }
        stack[++stackTop] = op === OP_IN_SCAN_REFS_CONST ? found : !found
        break
      }

      case OP_STORE_LOCAL:
        // Peek top (don't pop) and store into locals slot
        locals[numAt(bytecode[i++])] = stack[stackTop]
        break

      case OP_LOAD_LOCAL:
        stack[++stackTop] = locals[numAt(bytecode[i++])]
        break

      // ---------------------------------------------------------------------
      // Equality
      // ---------------------------------------------------------------------
      case OP_EQ:
      case OP_NE: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (needsReconstruct(left) || needsReconstruct(right)) {
          stack[++stackTop] = makeResidual([
            opNames[op],
            slotSrc(left),
            slotSrc(right),
          ])
        } else {
          const lv = slotVal(left)
          const rv = slotVal(right)
          stack[++stackTop] = op === OP_EQ ? lv === rv : lv !== rv
        }
        break
      }

      // ---------------------------------------------------------------------
      // Relational
      // ---------------------------------------------------------------------
      case OP_GT:
      case OP_GE:
      case OP_LT:
      case OP_LE: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (needsReconstruct(left) || needsReconstruct(right)) {
          stack[++stackTop] = makeResidual([
            opNames[op],
            slotSrc(left),
            slotSrc(right),
          ])
        } else {
          stack[++stackTop] = relationalCompare(
            slotVal(left),
            slotVal(right),
            op
          )
        }
        break
      }

      // ---------------------------------------------------------------------
      // Containment — dynamic fallback (both sides are refs)
      // ---------------------------------------------------------------------
      case OP_IN:
      case OP_NOT_IN: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (needsReconstruct(left) || needsReconstruct(right)) {
          stack[++stackTop] = makeResidual([
            opNames[op],
            slotSrc(left),
            slotSrc(right),
          ])
        } else {
          const l = slotVal(left)
          const r = slotVal(right)
          if (l === null || l === undefined || r === null || r === undefined) {
            stack[++stackTop] = op === OP_IN ? false : true
          } else if (Array.isArray(l)) {
            if (Array.isArray(r)) {
              throw new Error(
                op === OP_IN
                  ? 'IN: both operands are arrays'
                  : 'NOT IN: both operands are arrays'
              )
            }
            const found = l.indexOf(r) > -1
            stack[++stackTop] = op === OP_IN ? found : !found
          } else if (Array.isArray(r)) {
            const found = r.indexOf(l) > -1
            stack[++stackTop] = op === OP_IN ? found : !found
          } else {
            throw new Error(
              op === OP_IN
                ? 'IN: neither operand is an array'
                : 'NOT IN: neither operand is an array'
            )
          }
        }
        break
      }

      // ---------------------------------------------------------------------
      // Inline collection scan
      // ---------------------------------------------------------------------
      case OP_IN_COLLECTION:
      case OP_NOT_IN_COLLECTION: {
        const opcodePos = i - 1 // position of the opcode in bytecode
        const n = numAt(bytecode[i++])
        const collectionOnLeft = directionMap.get(opcodePos) === 0
        const scalarSlot = stack[stackTop--]
        const scalarIsUnknown = needsReconstruct(scalarSlot)
        // Check if any collection item needs reconstruction
        let hasUnknownItem = false
        for (let j = 0; j < n; j++) {
          if (needsReconstruct(stack[stackTop - j])) {
            hasUnknownItem = true
            break
          }
        }
        if (scalarIsUnknown || hasUnknownItem) {
          const items: Input[] = new Array(n)
          for (let j = 0; j < n; j++) {
            items[j] = slotSrc(stack[stackTop - (n - 1 - j)])
          }
          stackTop -= n
          // Reconstruct preserving original operand order
          const itemsInput: Input = items
          const reconstructed = collectionOnLeft
            ? [opNames[op], itemsInput, slotSrc(scalarSlot)]
            : [opNames[op], slotSrc(scalarSlot), itemsInput]
          stack[++stackTop] = makeResidual(reconstructed)
          break
        }
        // All concrete — inline scan using slotVal to unwrap Resolved
        const scalar = slotVal(scalarSlot)
        let found = false
        if (scalar !== null && scalar !== undefined) {
          for (let j = 0; j < n; j++) {
            if (slotVal(stack[stackTop - j]) === scalar) {
              found = true
              break
            }
          }
        }
        stackTop -= n
        stack[++stackTop] = op === OP_IN_COLLECTION ? found : !found
        break
      }

      case OP_IN_CONST:
      case OP_NOT_IN_CONST: {
        const opcodePos = i - 1 // position of the opcode in bytecode
        const constArr = compiled.consts[numAt(bytecode[i++])]
        const collectionOnLeft = directionMap.get(opcodePos) === 0
        const scalarSlot = stack[stackTop--]
        if (needsReconstruct(scalarSlot)) {
          const scalarInput = slotSrc(scalarSlot)
          const constInput: Input = constArr
          stack[++stackTop] = makeResidual([
            opNames[op],
            collectionOnLeft ? constInput : scalarInput,
            collectionOnLeft ? scalarInput : constInput,
          ])
          break
        }
        const scalar = slotVal(scalarSlot)
        if (scalar === null || scalar === undefined) {
          stack[++stackTop] = op === OP_IN_CONST ? false : true
          break
        }
        let s = overlapSetCache.get(constArr)
        if (s === undefined) {
          s = new Set<Result>(constArr)
          overlapSetCache.set(constArr, s)
        }
        const found = s.has(scalar)
        stack[++stackTop] = op === OP_IN_CONST ? found : !found
        break
      }

      case OP_OR_AND_IN_CONST_2: {
        // bytecode layout: ref1Idx, ref2Idx, M, aVal0, setBIdx0, aVal1, setBIdx1, ..., aValM-1, setBIdxM-1
        // aVal_j is a literal value; setBIdx_j is a constIdx for the merged setB.
        const ref1Idx = numAt(bytecode[i++])
        const ref2Idx = numAt(bytecode[i++])
        const n = numAt(bytecode[i++])
        const pairsStart = i
        i += n * 2

        const rawKey1 = refRawKeys[ref1Idx]
        const rawKey2 = refRawKeys[ref2Idx]
        const v1 = resolveCompactRef(refs[ref1Idx], ctx)
        const v2 = resolveCompactRef(refs[ref2Idx], ctx)

        const unknown1 =
          v1 === undefined &&
          !strictSet?.has(rawKey1) &&
          (!optionalSet || optionalSet.has(rawKey1))
        const unknown2 =
          v2 === undefined &&
          !strictSet?.has(rawKey2) &&
          (!optionalSet || optionalSet.has(rawKey2))

        if (unknown1 || unknown2) {
          // Reconstruct the original complex expression tree
          const branches: Input[] = [opNames[OP_OR]]
          const andOp = opNames[OP_AND]
          const eqOp = opNames[OP_EQ]
          const inOp = opNames[OP_IN]
          const r1 = refKeys[ref1Idx]
          const r2 = refKeys[ref2Idx]
          for (let j = 0; j < n; j++) {
            const aVal = literalAt(bytecode[pairsStart + j * 2])
            const setB =
              compiled.consts[numAt(bytecode[pairsStart + j * 2 + 1])]
            const setInput: Input = setB
            branches.push([andOp, [eqOp, r1, aVal], [inOp, r2, setInput]])
          }
          stack[++stackTop] = makeResidual(branches)
          break
        }

        // Both refs known — evaluate normally
        let found = false
        if (
          v1 !== null &&
          v1 !== undefined &&
          v2 !== null &&
          v2 !== undefined
        ) {
          for (let j = 0; j < n; j++) {
            if (bytecode[pairsStart + j * 2] === v1) {
              const setB =
                compiled.consts[numAt(bytecode[pairsStart + j * 2 + 1])]
              let s = overlapSetCache.get(setB)
              if (s === undefined) {
                s = new Set<Result>(setB)
                overlapSetCache.set(setB, s)
              }
              found = s.has(v2)
              break
            }
          }
        }
        stack[++stackTop] = found
        break
      }

      // ---------------------------------------------------------------------
      // String
      // ---------------------------------------------------------------------
      case OP_PREFIX:
      case OP_SUFFIX: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (needsReconstruct(left) || needsReconstruct(right)) {
          stack[++stackTop] = makeResidual([
            opNames[op],
            slotSrc(left),
            slotSrc(right),
          ])
        } else {
          const lv = slotVal(left)
          const rv = slotVal(right)
          stack[++stackTop] =
            op === OP_PREFIX
              ? isString(lv) && isString(rv)
                ? rv.startsWith(lv)
                : false
              : isString(lv) && isString(rv)
                ? lv.endsWith(rv)
                : false
        }
        break
      }

      // ---------------------------------------------------------------------
      // Array
      // ---------------------------------------------------------------------
      case OP_OVERLAP: {
        const right = stack[stackTop--]
        const left = stack[stackTop--]
        if (needsReconstruct(left) || needsReconstruct(right)) {
          stack[++stackTop] = makeResidual([
            opNames[op],
            slotSrc(left),
            slotSrc(right),
          ])
        } else {
          const l = slotVal(left)
          const r = slotVal(right)
          if (l === null || l === undefined || r === null || r === undefined) {
            stack[++stackTop] = false
          } else if (!Array.isArray(l) || !Array.isArray(r)) {
            throw new Error('OVERLAP: both operands must be arrays')
          } else if (l.length === 0 && r.length === 0) {
            stack[++stackTop] = true
          } else {
            stack[++stackTop] = l.some((el) => r.includes(el))
          }
        }
        break
      }

      // ---------------------------------------------------------------------
      // Presence
      // ---------------------------------------------------------------------
      case OP_PRESENT: {
        const val = stack[stackTop]
        if (needsReconstruct(val)) {
          stack[stackTop] = makeResidual([opNames[op], slotSrc(val)])
        } else {
          const v = slotVal(val)
          stack[stackTop] = v !== undefined && v !== null
        }
        break
      }

      case OP_UNDEFINED: {
        const val = stack[stackTop]
        if (needsReconstruct(val)) {
          stack[stackTop] = makeResidual([opNames[op], slotSrc(val)])
        } else {
          const v = slotVal(val)
          stack[stackTop] = v === undefined
        }
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
        // Check for any unknown operand
        let hasUnknown = false
        for (let j = 0; j < n; j++) {
          if (needsReconstruct(stack[stackTop - j])) {
            hasUnknown = true
            break
          }
        }
        if (hasUnknown) {
          const items: Input[] = new Array(n)
          for (let j = n - 1; j >= 0; j--) {
            items[j] = slotSrc(stack[stackTop--])
          }
          stack[++stackTop] = makeResidual([opNames[op], ...items])
          break
        }
        // Fast path: 2 operands, all concrete
        if (n === 2) {
          const bVal = slotVal(stack[stackTop--])
          const aVal = slotVal(stack[stackTop--])
          if (
            aVal === null ||
            aVal === undefined ||
            bVal === null ||
            bVal === undefined
          ) {
            stack[++stackTop] = false
            break
          }
          if (!isNumber(aVal) || !isNumber(bVal)) {
            throw new Error(
              `arithmetic operand is not a number: ${!isNumber(aVal) ? aVal : bVal}`
            )
          }
          // After the throw above, aVal and bVal are narrowed to number
          if (op === OP_SUM) {
            stack[++stackTop] = addDecimals(aVal, bVal)
          } else if (op === OP_SUBTRACT) {
            stack[++stackTop] = subtractDecimals(aVal, bVal)
          } else if (op === OP_MULTIPLY) {
            stack[++stackTop] = multiplyDecimals(aVal, bVal)
          } else {
            stack[++stackTop] = divideDecimals(aVal, bVal)
          }
          break
        }
        // N-operand path
        const values: number[] = new Array(n)
        let hasNull = false
        for (let j = n - 1; j >= 0; j--) {
          const v = slotVal(stack[stackTop--])
          if (v === null || v === undefined) {
            hasNull = true
            break
          }
          if (!isNumber(v)) {
            throw new Error(`arithmetic operand is not a number: ${v}`)
          }
          // After the throw above, v is narrowed to number
          values[j] = v
        }
        stack[++stackTop] = hasNull ? false : arithmeticReduce(values, op)
        break
      }

      // ---------------------------------------------------------------------
      // Logical
      // ---------------------------------------------------------------------
      case OP_NOT: {
        const val = stack[stackTop]
        if (needsReconstruct(val)) {
          const src = slotSrc(val)
          // If this NOT follows a NOR that already applied its simplification
          // (multi-residual NOR pushes a NOR expression), pass it through unchanged.
          if (Array.isArray(src) && src[0] === opNames[OP_NOR]) {
            // Already a NOR expression — leave it as-is
            break
          }
          stack[stackTop] = makeResidual([opNames[op], src])
        } else {
          const v = slotVal(val)
          if (typeof v !== 'boolean') {
            throw new Error('NOT: operand must be boolean')
          }
          stack[stackTop] = !v
        }
        break
      }

      case OP_JUMP_IF_FALSE: {
        const offset = numAt(bytecode[i++])
        const top = stack[stackTop]
        if (!needsReconstruct(top) && slotVal(top) === false) {
          i += offset
        }
        // Clear spill buffer when transitioning between short-circuit sequences.
        // Different jump opcodes (41=JUMP_IF_FALSE for AND vs 42=JUMP_IF_TRUE for OR/NOR)
        // indicate different short-circuit sequences.
        if (lastJumpOp !== 41) {
          spillTop = -1
        }
        lastJumpOp = 41
        break
      }

      case OP_JUMP_IF_TRUE: {
        const offset = numAt(bytecode[i++])
        const top = stack[stackTop]
        if (!needsReconstruct(top) && slotVal(top) === true) {
          i += offset
        }
        // Clear spill buffer when transitioning between short-circuit sequences.
        if (lastJumpOp !== 42) {
          spillTop = -1
        }
        lastJumpOp = 42
        break
      }

      case OP_POP: {
        const popped = stack[stackTop--]
        // If this residual is being discarded in a short-circuit sequence,
        // save it so OP_AND/OR/NOR can include it in the reconstructed expression.
        if (needsReconstruct(popped)) {
          spillBuf[++spillTop] = popped
        }
        break
      }

      // AND/OR/NOR markers — collect the current stack top plus any residuals
      // that were spilled by OP_POP during the short-circuit sequence, then
      // apply the simplification logic.
      case OP_AND: {
        i++ // consume the operand count byte (unused — we use the spill buffer)
        const top = stack[stackTop--]
        // Fast path: nothing was spilled — all non-top operands were concrete.
        // The top is either a short-circuit false, the last true, or a lone residual.
        // Push top directly — slotVal unwrapping happens at the final return point.
        if (spillTop < 0) {
          spillTop = -1
          if (!needsReconstruct(top)) {
            stack[++stackTop] = top
          } else {
            stack[++stackTop] = makeResidual(slotSrc(top))
          }
          break
        }
        const residuals: Input[] = []
        // Drain spill buffer (residuals from earlier operands that were POP'd)
        // Check if any spilled operand was false (dominates AND)
        let andDominated = false
        for (let j = 0; j <= spillTop; j++) {
          const v = spillBuf[j]
          if (!needsReconstruct(v) && slotVal(v) === false) {
            andDominated = true
            break
          }
          if (needsReconstruct(v)) {
            residuals.push(slotSrc(v))
          }
        }
        spillTop = -1 // clear spill buffer
        // Include the stack top (last operand result)
        if (!andDominated) {
          if (!needsReconstruct(top) && slotVal(top) === false) {
            andDominated = true
          } else if (needsReconstruct(top)) {
            residuals.push(slotSrc(top))
          }
        }
        if (andDominated) {
          stack[++stackTop] = false
        } else if (residuals.length === 0) {
          stack[++stackTop] = true
        } else if (residuals.length === 1) {
          stack[++stackTop] = makeResidual(residuals[0])
        } else {
          stack[++stackTop] = makeResidual([opNames[op], ...residuals])
        }
        break
      }

      case OP_OR: {
        i++ // consume the operand count byte
        const top = stack[stackTop--]
        // Fast path: nothing was spilled — all non-top operands were concrete.
        // Push top directly — slotVal unwrapping happens at the final return point.
        if (spillTop < 0) {
          spillTop = -1
          if (!needsReconstruct(top)) {
            stack[++stackTop] = top
          } else {
            stack[++stackTop] = makeResidual(slotSrc(top))
          }
          break
        }
        const residuals: Input[] = []
        let orDominated = false
        for (let j = 0; j <= spillTop; j++) {
          const v = spillBuf[j]
          if (!needsReconstruct(v) && slotVal(v) === true) {
            orDominated = true
            break
          }
          if (needsReconstruct(v)) {
            residuals.push(slotSrc(v))
          }
        }
        spillTop = -1
        if (!orDominated) {
          if (!needsReconstruct(top) && slotVal(top) === true) {
            orDominated = true
          } else if (needsReconstruct(top)) {
            residuals.push(slotSrc(top))
          }
        }
        if (orDominated) {
          stack[++stackTop] = true
        } else if (residuals.length === 0) {
          stack[++stackTop] = false
        } else if (residuals.length === 1) {
          stack[++stackTop] = makeResidual(residuals[0])
        } else {
          stack[++stackTop] = makeResidual([opNames[op], ...residuals])
        }
        break
      }

      case OP_NOR: {
        // Semantics: NOR = NOT OR. OP_NOT follows in bytecode.
        // For concrete booleans, we push the OR result so OP_NOT negates it.
        // For residuals with >1 terms, we apply NOR simplification directly
        // (returning a NOR expression) and push a "NOR_DONE" residual that
        // OP_NOT will pass through unchanged.
        i++ // consume the operand count byte
        const top = stack[stackTop--]
        const residuals: Input[] = []
        let dominated = false
        for (let j = 0; j <= spillTop; j++) {
          const v = spillBuf[j]
          if (!needsReconstruct(v) && slotVal(v) === true) {
            dominated = true
            break
          }
          if (needsReconstruct(v)) {
            residuals.push(slotSrc(v))
          }
        }
        spillTop = -1
        if (!dominated) {
          if (!needsReconstruct(top) && slotVal(top) === true) {
            dominated = true
          } else if (needsReconstruct(top)) {
            residuals.push(slotSrc(top))
          }
        }
        if (dominated) {
          // OR was true → push true so OP_NOT yields false (= NOR false)
          stack[++stackTop] = true
        } else if (residuals.length === 0) {
          // All false → push false so OP_NOT yields true (= NOR true)
          stack[++stackTop] = false
        } else if (residuals.length === 1) {
          // Single residual — OP_NOT will wrap in NOT(residual) ✓
          stack[++stackTop] = makeResidual(residuals[0])
        } else {
          // Multiple residuals — push NOR expression directly.
          // OP_NOT must pass it through unchanged (handled in OP_NOT case).
          stack[++stackTop] = makeResidual([opNames[op], ...residuals])
        }
        break
      }

      case OP_XOR: {
        // XOR is compiled as chained binary: (((A XOR B) XOR C) XOR D).
        // We accumulate residuals + trueCount into a XorState to defer finalization
        // until we know all operands. The XorState is finalized when used by another
        // operator or at the return point.
        const b = stack[stackTop--]
        const a = stack[stackTop--]

        // If neither has unknowns, compute the binary XOR directly (no state needed)
        // But for "one-hot" XOR semantics, if both are true, we need XorState(trueCount=2)
        // so subsequent chained XORs also see trueCount > 1.
        if (!needsReconstruct(a) && !needsReconstruct(b)) {
          const av = slotVal(a) === true
          const bv = slotVal(b) === true
          const trueCount = (av ? 1 : 0) + (bv ? 1 : 0)
          if (trueCount > 1) {
            // Both true → "one-hot" XOR is false, but track trueCount for chained XORs
            stack[++stackTop] = makeXorState([], trueCount)
          } else {
            stack[++stackTop] = (av || bv) && !(av && bv)
          }
          break
        }

        // Accumulate into a XorState
        let residuals: Input[]
        let trueCount: number

        if (isXorState(a)) {
          residuals = a.xorResiduals.slice()
          trueCount = a.xorTrueCount
        } else if (!needsReconstruct(a)) {
          residuals = []
          trueCount = slotVal(a) ? 1 : 0
        } else {
          residuals = [slotSrc(a)]
          trueCount = 0
        }

        if (isXorState(b)) {
          for (const r of b.xorResiduals) {
            residuals.push(r)
          }
          trueCount += b.xorTrueCount
        } else if (!needsReconstruct(b)) {
          if (slotVal(b)) {
            trueCount++
          }
        } else {
          residuals.push(slotSrc(b))
        }

        // If no residuals, resolve immediately
        // "One-hot" XOR: exactly one true → true, otherwise false
        // This matches the OOP evaluator's behavior.
        // Use XorState so subsequent chained XORs also see trueCount > 1.
        if (trueCount > 1) {
          stack[++stackTop] = makeXorState([], trueCount)
          break
        }

        if (residuals.length === 0) {
          stack[++stackTop] = trueCount % 2 === 1
          break
        }

        // Push accumulated state — finalized by slotSrc() when consumed by another op
        stack[++stackTop] = makeXorState(residuals, trueCount)
        break
      }

      default:
        throw new Error(`unknown opcode: ${op}`)
    }
  }

  // Unwrap the top slot to a plain Result | Input
  const top = stack[stackTop]
  if (isXorState(top) || isResidual(top) || isUnknownRef(top)) {
    return slotSrc(top)
  }
  const result = slotVal(top)
  if (result === undefined) {
    throw new Error('simplify: unexpected undefined top-level result')
  }
  return result as Input
}
