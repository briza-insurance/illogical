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
import { Context, Result } from '../common/evaluable.js';
import { DataType } from '../operand/reference.js';
export type PathToken = {
    kind: 'key';
    value: string;
} | {
    kind: 'index';
    value: number;
};
/** Full compact form for refs that don't fit the short string/string[] forms. */
export interface CompactRefFull {
    /** Raw key string for dynamic refs with {placeholder} substitution. */
    k?: string;
    /** True for dynamic refs. */
    d?: true;
    /** DataType cast, e.g. DataType.Number. */
    t?: DataType;
    /** Token list for paths containing array indexes or deep static paths. */
    tokens?: PathToken[];
}
/**
 * Runtime ref representation stored in CompiledExpression.refs:
 *   - `string`         → single plain-key (most common)
 *   - `string[]`       → multi-key inline path
 *   - `CompactRefFull` → token-based or dynamic
 */
export type CompactRef = string | string[] | CompactRefFull;
/**
 * Build a CompactRef from a raw reference key string (without the $ prefix).
 * Called once at compile time; the result is stored in CompiledExpression.refs.
 */
export declare function buildCompactRef(rawKey: string): CompactRef;
/** Type-safe property access on an object narrowed from `unknown`. */
export declare function propAt(obj: object, key: string): unknown;
/** Cast a resolved path-walk result to the public Result type. */
export declare function toResult(value: unknown): Result;
/**
 * Resolve a multi-key inline path (string[]) against a context.
 * Used by OP_PUSH_REF_KEYS and OP_PUSH_REF_DYNAMIC (after substitution).
 */
export declare function resolveKeys(ks: string[], ctx: Context): Result;
/**
 * Resolve a token-based path against a context.
 * Used by OP_PUSH_REF_TOKENS.
 */
export declare function resolveTokens(tokens: PathToken[], dataType: DataType | undefined, ctx: Context): Result;
/**
 * Resolve a dynamic ref (with {placeholder} substitution) against a context.
 * Used by OP_PUSH_REF_DYNAMIC.
 */
export declare function resolveDynamic(key: string, dataType: DataType | undefined, ctx: Context): Result;
/**
 * Resolve any CompactRef against a context.
 * Used in ops that embed ref indices but weren't split by kind
 * (OP_OVERLAP_SCAN_REFS_CONST, OP_OR_AND_IN_CONST_2).
 */
export declare function resolveCompactRef(ref: CompactRef, ctx: Context): Result;
