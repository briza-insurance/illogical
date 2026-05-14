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
   * @param options — Expressions map and optional parser options
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
   * Callback fires only for expressions whose result changed.
   *
   * @param callback — Called with list of changed expressions
   * @returns Unsubscribe function
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
   * Note: This recompiles the entire batch.
   *
   * @param name — Expression name
   * @param expression — Raw expression input
   */
  addExpression(name: string, expression: ExpressionInput): void {
    this.state.originalExpressions.set(name, expression)
    // Recompile
    this.recompile()
  }

  /**
   * Remove an expression from the batch.
   * Note: This recompiles the entire batch.
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
