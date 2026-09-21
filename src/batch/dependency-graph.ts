/**
 * Dependency graph for batch evaluation.
 *
 * Maps context keys to the expressions that reference them.
 * Built during compileBatch Phase 1 from the raw expression inputs
 * and the compiled refs table.
 */

import { Reference } from '../operand/reference.js'
import { ExpressionInput, Input } from '../parser/index.js'
import { Options } from '../parser/options.js'
import { DependencyEntry, DependencyGraph } from './types.js'

/**
 * Build a dependency graph from a compiled batch.
 *
 * Uses the compiled refs table to correctly resolve all ref types,
 * not just simple string refs.
 */
export function buildDependencyGraph(
  opts: Options,
  expressions: Map<string, ExpressionInput>
): DependencyGraph {
  const graph = new Map<string, DependencyEntry[]>()

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

    const transformed = reference.getKey()

    // TODO: Add tests for Dynamic refs. Might need to handle them differently in the graph.

    let entries = graph.get(transformed)
    if (entries === undefined) {
      entries = []
      graph.set(transformed, entries)
    }
    if (!entries.some((e) => e.exprName === exprName)) {
      entries.push({ exprName })
    }
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
        affected.add(entry.exprName)
      }
    }
  }

  return affected
}
