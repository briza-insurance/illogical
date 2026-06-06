/**
 * Batch evaluation module.
 *
 * Re-exports all public APIs from the batch evaluation submodules.
 */

export { compileBatch } from './compiler.js'
export { interpretSingle, interpretBatch } from './interpreter.js'
export {
  buildDependencyGraph,
  findAffectedExpressions,
} from './dependency-graph.js'
export { BatchEvaluator } from './evaluator.js'
export type {
  CompiledBatch,
  CompiledBatchExpression,
  DependencyEntry,
  DependencyGraph,
  EvaluatedResult,
  BatchEvaluatorState,
} from './types.js'
export type { BatchEvaluatorOptions } from './evaluator.js'
