import Engine from '../index.js'
import { ExpressionInput } from '../parser/index.js'
import { buildDependencyGraph } from './dependency-graph.js'
import { ParsedBatch } from './types.js'

/**
 * Parse a batch of expressions and build the corresponding dependency graph.
 *
 * @param engine — The engine instance used to parse expressions
 * @param expressions — Set of expression inputs to be parsed
 * @returns The parsed batch containing evaluables, dependency graph, and
 *   expressions with dynamic references
 */
export const parseBatch = (
  engine: Engine,
  expressions: Set<ExpressionInput>
): ParsedBatch => {
  const parsed: ParsedBatch = {
    expressions: new WeakMap(),
    dependencyGraph: new Map(),
    expressionsWithDynamic: new Set(),
  }

  for (const expr of expressions) {
    parsed.expressions.set(expr, engine.parse(expr))
  }

  const { graph, dynamicRefs } = buildDependencyGraph(
    expressions,
    parsed.expressions
  )

  parsed.dependencyGraph = graph
  parsed.expressionsWithDynamic = dynamicRefs

  return parsed
}
