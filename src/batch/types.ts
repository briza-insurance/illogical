/**
 * Types for the batch evaluation module.
 *
 * Defines the compiled batch structures, per-expression metadata,
 * and evaluator state used by the BatchEvaluator class.
 */

import { Bytecode } from '../bytecode/compiler.js'
import { CompactRef } from '../bytecode/refs.js'
import { Context, Result } from '../common/evaluable.js'
import { Input } from '../parser/index.js'

// ---------------------------------------------------------------------------
// Per-expression compiled metadata
// ---------------------------------------------------------------------------

/**
 * Compiled metadata for a single expression within a batch.
 *
 * Unlike CompiledExpression (which stores full objects in refs/consts),
 * this stores indices into shared arrays — enabling zero-copy ref/const
 * sharing across all expressions in the batch.
 */
export interface CompiledBatchExpression {
  /** Bytecode for this expression (same format as CompiledExpression.bytecode) */
  bytecode: Bytecode

  /** Indices into batch.sharedRefs — one entry per ref used by this expression */
  refs: number[]

  /** Indices into batch.sharedConsts — one entry per const array used by this expression */
  consts: number[]

  /** Pre-built residual ref arrays for OP_OVERLAP_SCAN_REFS_CONST */
  overlapRefsResiduals: Array<[number, Input[]]>

  /** Bytecode position → direction (0 = collection/const on left, 1 = on right) */
  directionMap: Array<[number, 0 | 1]>

  /** First context key per ref index (same as CompiledExpression.refFirstCtxKeys) */
  refFirstCtxKeys: (string | undefined)[]

  /** Runtime dirty flag — set to true when an affected context key changes */
  dirty: boolean
}

// ---------------------------------------------------------------------------
// Dependency graph
// ---------------------------------------------------------------------------

/**
 * A single entry in the dependency graph.
 * Maps a context key to the expressions that depend on it.
 */
export interface DependencyEntry {
  /** Name of the expression that depends on this key */
  exprName: string
  /** Index into batch.sharedRefs for this ref */
  refIdx: number
}

/**
 * Dependency graph: context key → list of { exprName, refIdx }.
 * Built during compileBatch Phase 1.
 */
export type DependencyGraph = Map<string, DependencyEntry[]>

// ---------------------------------------------------------------------------
// Compiled batch
// ---------------------------------------------------------------------------

/**
 * A compiled batch of expressions with shared resources.
 *
 * All expressions in the batch share:
 * - A single refs array (deduplicated across expressions)
 * - A single consts array (deduplicated across expressions)
 * - A single constSets cache (built lazily)
 * - The same opNames map (operator string → opcode)
 */
export interface CompiledBatch {
  /** Per-expression compiled data, keyed by expression name */
  expressions: Map<string, CompiledBatchExpression>

  /** Shared refs array — deduplicated across all expressions */
  sharedRefs: CompactRef[]

  /** Shared consts array — deduplicated across all expressions */
  sharedConsts: Input[][]

  /** Lazy-built Sets for const lookups, same pattern as constSetsCache in interpreter */
  sharedConstSets: Set<Result>[]

  /** Operator maps (opcode → operator string) */
  opNames: Record<number, string>

  /** Dependency graph: context key → expressions that reference it */
  dependencyGraph: DependencyGraph
}

// ---------------------------------------------------------------------------
// Evaluator state
// ---------------------------------------------------------------------------

/**
 * Result of evaluating a single expression — value and whether it changed.
 */
export interface EvaluatedResult {
  /** The computed result value */
  value: Result
  /** Whether this result differs from the previous cached value */
  changed: boolean
}

/**
 * State maintained by the BatchEvaluator across evaluate() calls.
 */
export interface BatchEvaluatorState {
  /** The compiled batch with shared resources */
  batch: CompiledBatch

  /** Last full context passed to evaluate() — used for context merging and deletion */
  lastContext: Context

  /** Cached results from the last evaluation */
  cachedResults: Record<string, Result>
}
