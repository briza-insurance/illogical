/**
 * Types for the batch evaluation module.
 *
 * Defines the compiled batch structures, per-expression metadata,
 * and evaluator state used by the BatchEvaluator class.
 */

import { Evaluable } from '../common/evaluable.js'

/**
 * A single entry in the dependency graph.
 * Maps a context key to the expressions that depend on it.
 */
// TODO: Do we need an object? Or change to Set<string> ???
export interface DependencyEntry {
  /** Name of the expression that depends on this key */
  exprName: string
}

/**
 * Dependency graph: context key → list of { exprName, refIdx }.
 * Built during compileBatch Phase 1.
 */
export type DependencyGraph = Map<string, DependencyEntry[]>

/**
 * A compiled batch of expressions with shared resources.
 *
 * All expressions in the batch share:
 * - A single refs array (deduplicated across expressions)
 * - A single consts array (deduplicated across expressions)
 * - A single constSets cache (built lazily)
 * - The same opNames map (operator string → opcode)
 */
export interface ParsedBatch {
  /** Per-expression compiled data, keyed by expression name */
  expressions: Map<string, Evaluable>

  /** Dependency graph: context key → expressions that reference it */
  dependencyGraph: DependencyGraph
}
