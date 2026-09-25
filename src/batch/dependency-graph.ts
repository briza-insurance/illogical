import { Context, Evaluable } from '../common/evaluable.js'
import { ExpressionInput } from '../parser/index.js'
import { DependencyGraph } from './types.js'

/**
 * Build a dependency graph from the list of raw expressions.
 *
 * @param expressions — Set of expression inputs
 * @param evaluablesMap — WeakMap mapping expression inputs to their evaluable
 *   representations
 * @returns An object containing the dependency graph and the set of expressions
 *   with dynamic references
 */
export function buildDependencyGraph(
  expressions: ExpressionInput[],
  evaluablesMap: WeakMap<ExpressionInput, Evaluable>
): {
  graph: DependencyGraph
  dynamicRefs: ExpressionInput[]
} {
  const graph: DependencyGraph = new Map<string, ExpressionInput[]>()
  const dynamicRefs: ExpressionInput[] = []

  for (const expr of expressions) {
    const evaluable = evaluablesMap.get(expr)
    if (evaluable === undefined) {
      throw new Error(
        `Evaluable for expression '${JSON.stringify(expr)}' not found`
      )
    }
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
  expression: ExpressionInput,
  graph: DependencyGraph,
  expressionsWithDynamic: ExpressionInput[]
): void {
  for (const key of evaluable.getReferences()) {
    // if the key is dynamic (contains '{' and '}'), add it to the dynamicRefs set
    if (key.includes('{') && key.includes('}')) {
      expressionsWithDynamic.push(expression)
    } else {
      const rootKey =
        key[0] === '[' || key[0] === '.' ? key : key.split(/[.[]/)[0]
      let entries = graph.get(rootKey)
      if (entries === undefined) {
        entries = []
        graph.set(rootKey, entries)
      }
      entries.push(expression)
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
 * Find all expressions affected by the context diff.
 *
 * @param currentContext — The current evaluation context
 * @param newContext — The new evaluation context with potential changes
 * @param graph — The dependency graph mapping context keys to expressions
 * @returns Expression inputs that are affected by the changes in the context
 */
export function findAffectedExpressions(
  currentContext: Context | undefined,
  newContext: Context,
  graph: DependencyGraph
): ExpressionInput[] {
  const affected: ExpressionInput[] = []
  const current = currentContext ?? {}

  for (const key of Object.keys(newContext)) {
    // Skip keys that have not changed between the current and new context.
    if (isEqual(current[key], newContext[key])) {
      continue
    }

    const entries = graph.get(key)
    if (entries) {
      for (const entry of entries) {
        affected.push(entry)
      }
    }
  }

  return affected
}
