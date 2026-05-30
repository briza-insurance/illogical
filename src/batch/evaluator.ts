/**
 * BatchEvaluator class.
 *
 * A stateful evaluator that compiles many expressions once, shares resources
 * (refs, consts, locals) across them, and evaluates them incrementally as
 * context changes.
 *
 * API:
 *   evaluate(ctx, changedKeys?) — Mode 1 (no keys) = full eval, Mode 2 (with keys) = incremental
 *   getResults() — Record<string, Result>
 *   dispose() — free internal caches
 *   onChange(callback) — subscribe to change events
 *   getDependencies() — Map<string, string[]> mapping key → expression names
 *   reset() — clear results
 *   addExpression(name, expression) — add a new expression
 *   removeExpression(name) — remove an expression
 */

import { Context, ContextValue, Result } from '../common/evaluable.js'
import { ExpressionInput } from '../parser/index.js'
import { defaultOptions, Options } from '../parser/options.js'
import { compileBatch } from './compiler.js'
import { findAffectedExpressions } from './dependency-graph.js'
import { interpretBatch } from './interpreter.js'
import { ChangeCallback, CompiledBatch } from './types.js'

/**
 * Options for creating a BatchEvaluator.
 */
export interface BatchEvaluatorOptions {
  /** Map of expression name → raw expression input */
  expressions: Record<string, ExpressionInput>
  /** Optional parser options shared across all expressions */
  options?: Partial<Options>
}

/**
 * State maintained by the BatchEvaluator.
 */
export interface BatchEvaluatorState {
  /** The compiled batch with shared resources */
  batch: CompiledBatch
  /** Original expressions map — stored for addExpression/removeExpression */
  originalExpressions: Map<string, ExpressionInput>
  /** Last full context passed to evaluate() */
  lastContext: Context
  /** Cached results from the last evaluation */
  cachedResults: Record<string, Result>
  /** Change callbacks registered via onChange() */
  onChangeCallbacks: ChangeCallback[]
}

/**
 * BatchEvaluator — compiles many expressions once, evaluates incrementally.
 */
export class BatchEvaluator {
  private state: BatchEvaluatorState
  private opts: Options

  /**
   * Create a new BatchEvaluator.
   *
   * Validates that all expression names in the initial expressions map are
   * unique. Throws a `TypeError` if any duplicate names are found.
   *
   * @param options — Expressions map and optional parser options
   * @throws TypeError if duplicate expression names are provided
   */
  constructor(options: BatchEvaluatorOptions) {
    this.opts = { ...defaultOptions }
    if (options.options) {
      for (const key of Object.keys(options.options)) {
        if (key in this.opts) {
          Reflect.set(this.opts, key, Reflect.get(options.options, key))
        }
      }
    }

    const expressionsMap = new Map<string, ExpressionInput>()
    for (const [name, expr] of Object.entries(options.expressions)) {
      if (expressionsMap.has(name)) {
        throw new TypeError(
          `Duplicate expression name: '${name}'. Expression names must be unique.`
        )
      }
      expressionsMap.set(name, expr)
    }

    const batch = compileBatch(expressionsMap, this.opts)

    this.state = {
      batch,
      originalExpressions: expressionsMap,
      lastContext: {},
      cachedResults: {},
      onChangeCallbacks: [],
    }
  }

  /**
   * Evaluate expressions against context.
   *
   * IMPORTANT — No inter-expression dependencies: Each expression depends only on
   * context keys (e.g., $status, $tier), not on the results of other expressions.
   * There is no concept of "expression A must evaluate before expression B."
   * The dependency graph tracks context-key → expression mappings, not
   * expression-to-expression relationships.
   *
   * This means:
   *   - The order of expressions in the batch does not matter.
   *   - The order of keys in `changedKeys` does not matter.
   *   - All affected expressions are re-evaluated in a single pass.
   *   - If Q2's expression references `$Q1` as a context key, changing Q1 will
   *     trigger re-evaluation of Q2 (via the dependency graph), but Q2 does not
   *     "depend on" Q1's result — it depends on the context key `Q1`.
   *
   * Mode 1 — No changedKeys: full re-evaluation of all expressions.
   *   Context is merged into stored context, all expressions run.
   *
   * Mode 2 — With changedKeys: incremental evaluation.
   *   Context is merged, only expressions affected by changedKeys run.
   *   The caller guarantees that only these keys actually changed.
   *
   * Mode 2 — With empty changedKeys []: no-op, returns cached results.
   *
   * @param ctx — Full evaluation context
   * @param changedKeys — Optional list of keys that changed (trusted by caller)
   * @returns Record mapping expression names to their Result values
   */
  evaluate(ctx: Context, changedKeys?: string[]): Record<string, Result> {
    // Capture old results for change comparison
    const oldResults = { ...this.state.cachedResults }
    const isFirstEvaluation = Object.keys(oldResults).length === 0

    // Merge caller's context into stored context
    this.mergeContext(ctx)

    // Mode 2: empty changedKeys — no-op, return cached results
    if (changedKeys !== undefined && changedKeys.length === 0) {
      return { ...this.state.cachedResults }
    }

    let dirtyExpressions: Set<string> | undefined

    if (changedKeys === undefined) {
      // Mode 1: full re-evaluation
      dirtyExpressions = undefined
    } else {
      // Mode 2: incremental — find affected expressions from dependency graph
      dirtyExpressions = findAffectedExpressions(
        this.state.batch.dependencyGraph,
        changedKeys
      )

      if (dirtyExpressions.size === 0) {
        return { ...this.state.cachedResults }
      }
    }

    // Run evaluation
    const newResults = interpretBatch(
      this.state.batch,
      this.state.lastContext,
      dirtyExpressions
    )

    // Merge new results into cached results
    for (const [name, value] of Object.entries(newResults)) {
      this.state.cachedResults[name] = value
    }

    // Fire onChange callbacks (skip on first evaluation — no previous state)
    if (!isFirstEvaluation) {
      const changes: { name: string; previous: Result; current: Result }[] = []
      for (const [name, value] of Object.entries(newResults)) {
        const previous = oldResults[name]
        if (previous !== value) {
          changes.push({ name, previous: previous as Result, current: value })
        }
      }

      if (changes.length > 0) {
        for (const callback of this.state.onChangeCallbacks) {
          callback(changes)
        }
      }
    }

    return { ...this.state.cachedResults }
  }

  /**
   * Get the full results of all expressions.
   * @returns Record mapping expression names to their Result values
   */
  getResults(): Record<string, Result> {
    return { ...this.state.cachedResults }
  }

  /**
   * Dispose the batch evaluator — frees internal caches.
   */
  dispose(): void {
    this.state.cachedResults = {}
    this.state.lastContext = {}
    this.state.onChangeCallbacks = []
    this.state.originalExpressions.clear()
    this.state.batch.sharedConstSets = []
  }

  /**
   * Subscribe to change notifications.
   *
   * The callback fires only for expressions whose result changed between
   * evaluations (not for expressions that were re-evaluated but produced
   * the same result). This makes it ideal for reactive UI updates, logging,
   * and state synchronization without unnecessary work.
   *
   * Typical subscribers:
   *   - UI components that need to re-render when a computed value changes
   *     Example: A dashboard widget showing "User Access Level" could subscribe
   *     and update its display only when the `canAccess` expression result flips.
   *   - Logging/monitoring systems that track how often expression results change
   *   - State synchronization layers that push changes to remote services
   *   - Caches that need to invalidate downstream derived data
   *
   * @param callback — Called with list of changed expressions
   * @returns Unsubscribe function that removes the callback when invoked
   */
  onChange(callback: ChangeCallback): () => void {
    this.state.onChangeCallbacks.push(callback)
    return () => {
      const idx = this.state.onChangeCallbacks.indexOf(callback)
      if (idx !== -1) {
        this.state.onChangeCallbacks.splice(idx, 1)
      }
    }
  }

  /**
   * Get dependency information.
   * @returns Map of context key → list of expression names that depend on it
   */
  getDependencies(): Map<string, string[]> {
    const deps = new Map<string, string[]>()
    for (const [key, entries] of this.state.batch.dependencyGraph) {
      const exprNames = [...new Set(entries.map((e) => e.exprName))]
      deps.set(key, exprNames)
    }
    return deps
  }

  /**
   * Reset all results to undefined (for fresh evaluation without recompilation).
   */
  reset(): void {
    this.state.cachedResults = {}
    for (const expr of this.state.batch.expressions.values()) {
      expr.dirty = true
    }
  }

  /**
   * Add a new expression to the batch.
   *
   * This recompiles the entire batch (Phase 1–3: ref collection, dependency
   * graph, bytecode compilation). Cached results for existing expressions are
   * preserved — only the newly added expression starts as dirty and will be
   * evaluated on the next `evaluate()` call.
   *
   * @param name — Expression name (must be unique; throws if already exists)
   * @param expression — Raw expression input
   * @throws TypeError if an expression with this name already exists
   */
  addExpression(name: string, expression: ExpressionInput): void {
    if (this.state.originalExpressions.has(name)) {
      throw new TypeError(
        `Duplicate expression name: '${name}'. Expression names must be unique.`
      )
    }
    this.state.originalExpressions.set(name, expression)
    // Recompile
    this.recompile()
  }

  /**
   * Remove an expression from the batch.
   *
   * This recompiles the entire batch (Phase 1–3). The removed expression's
   * cached result is cleared, and the expression is excluded from future
   * evaluations. Other expressions' cached results are preserved.
   *
   * @param name — Expression name to remove
   */
  removeExpression(name: string): void {
    this.state.originalExpressions.delete(name)
    delete this.state.cachedResults[name]
    // Recompile
    this.recompile()
  }

  /**
   * Recompile the batch from stored original expressions.
   */
  private recompile(): void {
    const batch = compileBatch(this.state.originalExpressions, this.opts)
    // Preserve cached results for expressions that still exist
    const preservedResults: Record<string, Result> = {}
    for (const name of batch.expressions.keys()) {
      if (name in this.state.cachedResults) {
        preservedResults[name] = this.state.cachedResults[name]
      }
    }
    this.state.batch = batch
    this.state.cachedResults = preservedResults
  }

  /**
   * Merge caller's context into stored context.
   * Handles deletion via undefined sentinel.
   */
  private mergeContext(ctx: Context): void {
    for (const key of Object.keys(ctx)) {
      const newVal = ctx[key]
      if (newVal === undefined) {
        if (key in this.state.lastContext) {
          delete this.state.lastContext[key]
        }
      } else {
        this.state.lastContext[key] = newVal as ContextValue
      }
    }
  }
}
