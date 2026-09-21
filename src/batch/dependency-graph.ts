import { Context } from '../common/evaluable.js'
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
): { graph: DependencyGraph; dynamicRefs: Set<string> } {
  const graph = new Map<string, Set<string>>()
  const dynamicRefs = new Set<string>()

  for (const [exprName, raw] of expressions) {
    collectRefsFromExpression(raw, exprName, graph, dynamicRefs, opts)
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
  expression: Input,
  expressionName: string,
  graph: DependencyGraph,
  expressionsWithDynamic: Set<string>,
  opts: Options
): void {
  if (Array.isArray(expression)) {
    for (let i = 0; i < expression.length; i++) {
      collectRefsFromExpression(
        expression[i],
        expressionName,
        graph,
        expressionsWithDynamic,
        opts
      )
    }
  } else if (
    typeof expression === 'string' &&
    opts.referencePredicate(expression)
  ) {
    // Reuse Reference key logic to handle complex keys, casting, and array indices correctly.
    const reference = new Reference(opts.referenceTransform(expression))

    const key = reference.getKey()

    // Normalize the key extracting the root part before any complex components.
    // Ideally, Reference operand should provide a method to directly get the
    // root key, but this is not available yet.
    const rootKey =
      key[0] === '[' || key[0] === '.' ? key : key.split(/[.[]/)[0]

    // if the key is dynamic (contains '{' and '}'), add it to the dynamicRefs set
    if (key.includes('{')) {
      expressionsWithDynamic.add(expressionName)
    } else {
      let entries = graph.get(rootKey)
      if (entries === undefined) {
        entries = new Set<string>()
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
): Set<string> {
  const affected = new Set<string>()
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
