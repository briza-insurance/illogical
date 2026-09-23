import { Context, Evaluable, Result } from '../common/evaluable.js'
import { ExpressionInput } from '../index.js'
import { Options } from '../parser/options.js'

/**
 * Dependency graph: context key → list of expression names.
 * Built during compileBatch Phase 1.
 */
export type DependencyGraph = Map<string, Set<string>>

/**
 * A compiled batch of expressions with shared resources.
 *
 * All expressions in the batch share:
 * - A single refs array (deduplicated across expressions)
 * - A single consts array (deduplicated across expressions)
 * - A single constSets cache (built lazily)
 * - The same opNames map (operator string → opcode)
 */
export type ParsedBatch = {
  /** Per-expression compiled data, keyed by expression name */
  expressions: Map<string, Evaluable>
  /** Dependency graph: context key → expressions that reference it */
  dependencyGraph: DependencyGraph
  /** List of expressions with dynamic references that should always be re-evaluated */
  expressionsWithDynamic: Set<string>
}

export type BatchEvaluatorOptions = {
  /** Map of expression name → raw expression input */
  expressions: Record<string, ExpressionInput>
  /** Optional parser options shared across all expressions */
  options?: Partial<Options>
}

export type BatchEvaluatorState = {
  /** The map of parsed expressions and their dependencies */
  batch: ParsedBatch
  /** Original expressions map — stored for addExpression/removeExpression */
  originalExpressions: Map<string, ExpressionInput>
  /** Last full context passed to evaluate() */
  lastContext: Context | undefined
  /** Cached results from the last evaluation */
  cachedResults: Record<string, Result>
  /** Expressions marked for evaluation in the next `evaluate()` call */
  markedForEvaluation: Set<string>
}
