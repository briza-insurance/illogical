/**
 * Dependency graph for batch evaluation.
 *
 * Maps context keys to the expressions that reference them.
 * Built during compileBatch Phase 1 from the raw expression inputs
 * and the compiled refs table.
 */

import { CompactRef } from '../bytecode/refs.js'
import { ExpressionInput, Input } from '../parser/index.js'
import { Options } from '../parser/options.js'
import { DependencyEntry, DependencyGraph } from './types.js'

/**
 * Extract the top-level context key(s) from a CompactRef.
 *
 * For dependency tracking, we need to know which context keys an expression
 * depends on. Different ref types expose their keys differently:
 *   - string ('account')         → top-level key: 'account'
 *   - string[] (['account','region']) → top-level keys: ['account', 'region']
 *   - CompactRefFull (tokens)    → top-level keys from tokens
 *   - CompactRefFull (dynamic)   → keys from static parts of the template
 */
function getTopLevelKeys(ref: CompactRef): string[] {
  if (typeof ref === 'string') {
    return [ref]
  }

  if (Array.isArray(ref)) {
    return ref
  }

  // CompactRefFull
  if (ref.tokens && ref.tokens.length > 0) {
    // Token-based path: extract all key tokens
    const keys: string[] = []
    for (const token of ref.tokens) {
      if (token.kind === 'key') {
        keys.push(token.value)
      }
    }
    return keys.length > 0 ? keys : ['__dynamic__']
  }

  if (ref.d && ref.k) {
    // Dynamic ref with {placeholder} substitution.
    // Extract static key parts from the template string.
    // e.g. '{region}.city' → static key: 'city'
    // e.g. '$region.city' → the template after resolving {region}
    // We extract all static key segments that aren't inside {..}
    const staticKeys: string[] = []
    // Split by {placeholder} patterns and extract remaining static parts
    const parts = ref.k.split(/\{[^}]+\}/)
    for (const part of parts) {
      if (part.length > 0) {
        // part is like '.city' or 'address' — extract key names
        const keyNames = part.match(/[a-zA-Z_][a-zA-Z0-9_]*/g)
        if (keyNames) {
          staticKeys.push(...keyNames)
        }
      }
    }
    return staticKeys.length > 0 ? staticKeys : ['__dynamic__']
  }

  return ['__dynamic__']
}

/**
 * Build a dependency graph from a compiled batch.
 *
 * Uses the compiled refs table to correctly resolve all ref types,
 * not just simple string refs.
 */
export function buildDependencyGraph(
  expressions: Map<string, ExpressionInput>,
  sharedRefs: CompactRef[],
  refKeys: string[],
  opts: Options
): DependencyGraph {
  const graph = new Map<string, DependencyEntry[]>()

  for (const [exprName, raw] of expressions) {
    collectRefsFromExpression(raw, exprName, graph, sharedRefs, refKeys, opts)
  }

  return graph
}

/**
 * Recursively collect refs from an expression tree.
 * Uses the compiled refs table to correctly resolve all ref types.
 */
function collectRefsFromExpression(
  input: Input,
  exprName: string,
  graph: DependencyGraph,
  sharedRefs: CompactRef[],
  refKeys: string[],
  opts: Options
): void {
  if (Array.isArray(input)) {
    for (let i = 1; i < input.length; i++) {
      collectRefsFromExpression(
        input[i],
        exprName,
        graph,
        sharedRefs,
        refKeys,
        opts
      )
    }
  } else if (typeof input === 'string' && opts.referencePredicate(input)) {
    const transformed = opts.referenceTransform(input)

    // Find the ref index in sharedRefs
    // For multi-key refs like '$account.region', the raw string transforms to
    // 'account.region', but in sharedRefs it's stored as ['account', 'region'].
    // For token-based refs like '$items[0]', it's stored as CompactRefFull.
    // We need to check all forms.
    let refIdx = -1
    for (let j = 0; j < sharedRefs.length; j++) {
      const ref = sharedRefs[j]
      if (typeof ref === 'string' && ref === transformed) {
        refIdx = j
        break
      }
      // Check multi-key refs: ['account','region'] → 'account.region'
      if (Array.isArray(ref)) {
        const serialized = ref.join('.')
        if (serialized === transformed) {
          refIdx = j
          break
        }
      }
      // Check token-based refs: { tokens: [...] } → reconstruct key path
      // e.g. $items[0] → 'items[0]'
      if (
        typeof ref === 'object' &&
        ref !== null &&
        'tokens' in ref &&
        ref.tokens
      ) {
        // Reconstruct the key path from tokens
        const parts: string[] = []
        for (const token of ref.tokens) {
          if (token.kind === 'key') {
            parts.push(token.value)
          } else if (token.kind === 'index') {
            parts.push(`[${token.value}]`)
          }
        }
        const reconstructed = parts.join('')
        if (reconstructed === transformed) {
          refIdx = j
          break
        }
      }
    }
    if (refIdx === -1) {
      return
    }

    // Get the top-level context key(s) from the compiled ref
    const topLevelKeys = getTopLevelKeys(sharedRefs[refIdx])

    for (const ctxKey of topLevelKeys) {
      if (ctxKey === '__dynamic__') {
        continue
      }

      let entries = graph.get(ctxKey)
      if (entries === undefined) {
        entries = []
        graph.set(ctxKey, entries)
      }
      if (
        !entries.some((e) => e.exprName === exprName && e.refIdx === refIdx)
      ) {
        entries.push({ exprName, refIdx })
      }
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
