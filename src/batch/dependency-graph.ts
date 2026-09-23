import { Context, Evaluable } from '../common/evaluable.js'
import { ExpressionInput } from '../parser/index.js'
import { DependencyGraph } from './types.js'

/**
 * Build a dependency graph from the list of raw expressions.
 */
export function buildDependencyGraph(
  expressions: Map<ExpressionInput, Evaluable>
): {
  graph: DependencyGraph
  dynamicRefs: Set<ExpressionInput>
} {
  const graph = new Map<string, Set<ExpressionInput>>()
  const dynamicRefs = new Set<ExpressionInput>()

  for (const [expr, evaluable] of expressions) {
    collectRefsFromExpression(evaluable, expr, graph, dynamicRefs)
  }

  return { graph, dynamicRefs }
}

/**
 * Recursively collect refs from an expression tree and marks them as
 * dependencies in the graph.
 *
 * This function mutates the graph directly.
 * This function mutates the list of dynamic references.
 */
function collectRefsFromExpression(
  evaluable: Evaluable,
  expressionName: ExpressionInput,
  graph: DependencyGraph,
  expressionsWithDynamic: Set<ExpressionInput>
): void {
  for (const key of evaluable.getReferences()) {
    // if the key is dynamic (contains '{' and '}'), add it to the dynamicRefs set
    if (key.includes('{')) {
      expressionsWithDynamic.add(expressionName)
    } else {
      const rootKey =
        key[0] === '[' || key[0] === '.' ? key : key.split(/[.[]/)[0]
      let entries = graph.get(rootKey)
      if (entries === undefined) {
        entries = new Set<ExpressionInput>()
        graph.set(rootKey, entries)
      }
      entries.add(expressionName)
    }
  }
}

function hasProperty<Obj extends object, Prop extends string>(
  obj: Obj,
  prop: Prop
): obj is Obj & Record<Prop, unknown> {
  return prop in obj
}

/**
 * Check if two values are deeply equal.
 * For arrays, it needs to contain the same elements in the same order.
 * For objects, it checks that all keys exist in both objects and that the
 * values are equal.
 */
function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false
      }
    }
    return true
  }

  if (Array.isArray(b)) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) {
    return false
  }

  for (const [key, value] of Object.entries(b)) {
    if (!hasProperty(a, key) || !isEqual(a[key], value)) {
      return false
    }
  }

  return true
}

/**
 * Find all expression names affected by the context diff.
 */
export function findAffectedExpressions(
  currentContext: Context | undefined,
  newContext: Context,
  graph: DependencyGraph
): Set<ExpressionInput> {
  const affected = new Set<ExpressionInput>()
  const current = currentContext ?? {}

  for (const key of Object.keys(newContext)) {
    // Skip keys that have not changed between the current and new context.
    if (isEqual(current[key], newContext[key])) {
      continue
    }

    const entries = graph.get(key)
    if (entries) {
      for (const entry of entries) {
        affected.add(entry)
      }
    }
  }

  return affected
}
