/**
 * Reference path descriptors for the bytecode compiler and interpreter.
 *
 * CompactRef is the single runtime type stored in CompiledExpression.refs.
 * The compiler picks the right opcode per ref kind so the interpreter
 * dispatches to a dedicated handler with no secondary branching.
 *
 *   string          — OP_PUSH_REF_KEY    — ctx[key]
 *   string[]        — OP_PUSH_REF_KEYS   — inline multi-key walk
 *   CompactRefFull (tokens)  — OP_PUSH_REF_TOKENS  — token walk + optional cast
 *   CompactRefFull (dynamic) — OP_PUSH_REF_DYNAMIC — runtime {placeholder} substitution
 */

import { Context, Result } from '../common/evaluable.js'
import { toNumber, toString } from '../common/util.js'
import { DataType } from '../operand/reference.js'

export type PathToken =
  | { kind: 'key'; value: string } // plain key:   address
  | { kind: 'index'; value: number } // array index: [0]

/** Full compact form for refs that don't fit the short string/string[] forms. */
export interface CompactRefFull {
  /** Raw key string for dynamic refs with {placeholder} substitution. */
  k?: string
  /** True for dynamic refs. */
  d?: true
  /** DataType cast, e.g. DataType.Number. */
  t?: DataType
  /** Token list for paths containing array indexes or deep static paths. */
  tokens?: PathToken[]
}

/**
 * Runtime ref representation stored in CompiledExpression.refs:
 *   - `string`         → single plain-key (most common)
 *   - `string[]`       → multi-key inline path
 *   - `CompactRefFull` → token-based or dynamic
 */
export type CompactRef = string | string[] | CompactRefFull

// ---------------------------------------------------------------------------
// Regex — parsed once at compile time
// ---------------------------------------------------------------------------
const keyWithArrayIndexRegex =
  /^(?<currentKey>[^[\]]+?)(?<indexes>(?:\[\d+])+)?$/
const arrayIndexRegex = /\[(\d+)]/g
const parseKeyRegex = /(`[^[\]]+`(\[\d+\])*|[^`.]+)/g

const dataTypeRegex = new RegExp(
  `^.+\\.\\((${Object.keys(DataType).join('|')})\\)$`
)
const castingRegex = /\.\(.+\)$/

function parseBacktickWrappedKey(key: string): string {
  return key[0] === '`' && key[key.length - 1] === '`' ? key.slice(1, -1) : key
}

function parseKeyComponents(key: string): PathToken[] {
  const unwrapped = parseBacktickWrappedKey(key)
  const tokens: PathToken[] = []
  const match = keyWithArrayIndexRegex.exec(unwrapped)
  if (match) {
    tokens.push({
      kind: 'key',
      value: parseBacktickWrappedKey(match.groups?.currentKey ?? unwrapped),
    })
    const rawIndexes = match.groups?.indexes
    if (rawIndexes) {
      for (const idxMatch of rawIndexes.matchAll(arrayIndexRegex)) {
        tokens.push({ kind: 'index', value: parseInt(idxMatch[1]) })
      }
    }
  } else {
    tokens.push({ kind: 'key', value: unwrapped })
  }
  return tokens
}

function parseStaticKey(key: string): PathToken[] {
  const parts = key.match(parseKeyRegex)
  return !parts ? [] : parts.flatMap(parseKeyComponents)
}

function isDataTypeKey(k: string): k is keyof typeof DataType {
  return k in DataType
}

/**
 * Build a CompactRef from a raw reference key string (without the $ prefix).
 * Called once at compile time; the result is stored in CompiledExpression.refs.
 */
export function buildCompactRef(rawKey: string): CompactRef {
  let key = rawKey
  let dataType: DataType | undefined

  const dataTypeMatch = dataTypeRegex.exec(key)
  if (dataTypeMatch) {
    const dtKey = dataTypeMatch[1]
    if (!isDataTypeKey(dtKey)) {
      throw new Error(`unknown DataType: ${dtKey}`)
    }
    dataType = DataType[dtKey]
    key = key.replace(castingRegex, '')
  }

  const hasDynamic = key.indexOf('{') > -1

  if (hasDynamic) {
    const full: CompactRefFull = { k: key, d: true }
    if (dataType !== undefined) {
      full.t = dataType
    }
    return full
  }

  const tokens = parseStaticKey(key)

  // Pure key-only path with no dataType → string or string[]
  if (!dataType && tokens.every((t) => t.kind === 'key')) {
    if (tokens.length === 1) {
      return tokens[0].value as string
    }
    return tokens.map((t) => t.value as string)
  }

  // Token-based path (array indexes) or dataType cast
  const full: CompactRefFull = { tokens }
  if (dataType !== undefined) {
    full.t = dataType
  }
  return full
}

// ---------------------------------------------------------------------------
// Runtime resolution — called by the interpreter on every evaluate()
// ---------------------------------------------------------------------------

function castValue(value: Result, dataType: DataType): Result {
  let result: Result
  if (dataType === DataType.Number) {
    result = toNumber(value)
  } else {
    result = toString(value)
  }
  if (value && result === undefined) {
    console.warn(`Casting ${value} to ${dataType} resulted in ${result}`)
  }
  return result
}

// Matches the innermost {ref} — non-nested braces only
const dynamicKeyRegex = /{([^{}]+)}/

/** Type-safe property access on an object narrowed from `unknown`. */
export function propAt(obj: object, key: string): Result {
  return Reflect.get(obj, key)
}

/** Narrow a CompactRef to its string form (OP_PUSH_REF_KEY). Throws on mismatch. */
export function asKeyRef(ref: CompactRef): string {
  if (typeof ref !== 'string') {
    throw new Error('bytecode integrity: expected string ref')
  }
  return ref
}

/** Narrow a CompactRef to its string[] form (OP_PUSH_REF_KEYS). Throws on mismatch. */
export function asKeysRef(ref: CompactRef): string[] {
  if (!Array.isArray(ref)) {
    throw new Error('bytecode integrity: expected string[] ref')
  }
  return ref
}

/** Narrow a CompactRef to CompactRefFull (OP_PUSH_REF_TOKENS / OP_PUSH_REF_DYNAMIC). Throws on mismatch. */
export function asFullRef(ref: CompactRef): CompactRefFull {
  if (typeof ref === 'string' || Array.isArray(ref)) {
    throw new Error('bytecode integrity: expected CompactRefFull ref')
  }
  return ref
}

/**
 * Resolve a multi-key inline path (string[]) against a context.
 * Used by OP_PUSH_REF_KEYS and OP_PUSH_REF_DYNAMIC (after substitution).
 */
export function resolveKeys(ks: string[], ctx: Context): Result {
  const p0 = ctx[ks[0]]
  if (ks.length === 1) {
    return p0
  }
  if (
    p0 === undefined ||
    p0 === null ||
    typeof p0 !== 'object' ||
    Array.isArray(p0)
  ) {
    return undefined
  }
  const p1 = propAt(p0, ks[1])
  if (ks.length === 2) {
    return p1
  }
  if (
    p1 === undefined ||
    p1 === null ||
    typeof p1 !== 'object' ||
    Array.isArray(p1)
  ) {
    return undefined
  }
  const p2 = propAt(p1, ks[2])
  if (ks.length === 3) {
    return p2
  }
  let p: Result = p2
  for (let k = 3; k < ks.length; k++) {
    if (
      p === undefined ||
      p === null ||
      typeof p !== 'object' ||
      Array.isArray(p)
    ) {
      return undefined
    }
    p = propAt(p, ks[k])
  }
  return p
}

/**
 * Resolve a token-based path against a context.
 * Used by OP_PUSH_REF_TOKENS.
 */
export function resolveTokens(
  tokens: PathToken[],
  dataType: DataType | undefined,
  ctx: Context
): Result {
  const len = tokens.length
  let pointer: Result = ctx

  for (let i = 0; i < len; i++) {
    const token = tokens[i]
    if (pointer === undefined || pointer === null) {
      return dataType !== undefined ? castValue(undefined, dataType) : undefined
    }
    if (token.kind === 'key') {
      if (typeof pointer !== 'object' || Array.isArray(pointer)) {
        return dataType !== undefined
          ? castValue(undefined, dataType)
          : undefined
      }
      pointer = propAt(pointer, token.value)
    } else {
      if (!Array.isArray(pointer)) {
        return dataType !== undefined
          ? castValue(undefined, dataType)
          : undefined
      }
      pointer = pointer[token.value]
    }
  }

  return dataType !== undefined ? castValue(pointer, dataType) : pointer
}

/**
 * Resolve a dynamic ref (with {placeholder} substitution) against a context.
 * Used by OP_PUSH_REF_DYNAMIC.
 */
export function resolveDynamic(
  key: string,
  dataType: DataType | undefined,
  ctx: Context
): Result {
  let current = key
  let match = dynamicKeyRegex.exec(current)

  while (match) {
    const inner = resolveTokens(parseStaticKey(match[1]), undefined, ctx)
    if (inner === undefined) {
      return undefined
    }
    current = current.replace(dynamicKeyRegex, `${inner}`)
    match = dynamicKeyRegex.exec(current)
  }

  const tokens = parseStaticKey(current)
  const raw = resolveTokens(tokens, undefined, ctx)
  return dataType !== undefined ? castValue(raw!, dataType) : raw
}

/**
 * Resolve any CompactRef against a context.
 * Used in ops that embed ref indices but weren't split by kind
 * (OP_OVERLAP_SCAN_REFS_CONST, OP_OR_AND_IN_CONST_2).
 */
export function resolveCompactRef(ref: CompactRef, ctx: Context): Result {
  if (typeof ref === 'string') {
    return ctx[ref]
  }
  if (Array.isArray(ref)) {
    return resolveKeys(ref, ctx)
  }
  if (ref.d) {
    return resolveDynamic(ref.k!, ref.t, ctx)
  }
  return resolveTokens(ref.tokens ?? [], ref.t, ctx)
}
