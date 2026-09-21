import { Reference } from '../operand/reference.js'
import { ExpressionInput, Input } from '../parser/index.js'
import { Options } from '../parser/options.js'
import { DependencyGraph } from './types.js'

/**
 * Build a dependency graph from the list of raw expressions.
 */
export function buildDependencyGraph(
  opts: Options,
  expressions: Map<string, ExpressionInput>
): DependencyGraph {
  const graph = new Map<string, Set<string>>()

  for (const [exprName, raw] of expressions) {
    collectRefsFromExpression(raw, exprName, graph, opts)
  }

  return graph
}

/**
 * Recursively collect refs from an expression tree and marks them as
 * dependencies in the graph. This function mutates the graph directly.
 */
function collectRefsFromExpression(
  expression: Input,
  exprName: string,
  graph: DependencyGraph,
  opts: Options
): void {
  if (Array.isArray(expression)) {
    for (let i = 1; i < expression.length; i++) {
      collectRefsFromExpression(expression[i], exprName, graph, opts)
    }
  } else if (
    typeof expression === 'string' &&
    opts.referencePredicate(expression)
  ) {
    // Reuse Reference key logic to handle complex keys, casting, and array indices correctly.
    const reference = new Reference(opts.referenceTransform(expression))

    const key = reference.getKey()

    let entries = graph.get(key)
    if (entries === undefined) {
      entries = new Set<string>()
      graph.set(key, entries)
    }
    entries.add(exprName)
  }
}

/**
 * Find all expression names affected by a set of changed context keys.
 */
export function findAffectedExpressions(
  graph: DependencyGraph,
  changedKeys: string[]
): Set<string> {
  const affected = new Set<string>()

  for (const key of changedKeys) {
    const entries = graph.get(key)
    if (entries) {
      for (const entry of entries) {
        affected.add(entry)
      }
    }
  }

  return affected
}
