import { Context, ContextValue, Result } from '../common/evaluable.js'
import Engine from '../index.js'
import { ExpressionInput } from '../parser/index.js'
import { defaultOptions, Options } from '../parser/options.js'
import { findAffectedExpressions } from './dependency-graph.js'
import { evaluateBatch } from './evaluate.js'
import { parseBatch } from './parse.js'
import { ParsedBatch } from './types.js'

export interface BatchEvaluatorOptions {
  /** Map of expression name → raw expression input */
  expressions: Record<string, ExpressionInput>
  /** Optional parser options shared across all expressions */
  options?: Partial<Options>
}

export interface BatchEvaluatorState {
  /** The map of parsed expressions and their dependencies */
  batch: ParsedBatch
  /** Original expressions map — stored for addExpression/removeExpression */
  originalExpressions: Map<string, ExpressionInput>
  /** Last full context passed to evaluate() */
  lastContext: Context
  /** Cached results from the last evaluation */
  cachedResults: Record<string, Result>
}

export class BatchEngine {
  private engine: Engine
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

    this.engine = new Engine(this.opts)

    const expressionsMap = new Map<string, ExpressionInput>()
    for (const [name, expr] of Object.entries(options.expressions)) {
      if (expressionsMap.has(name)) {
        throw new TypeError(
          `Duplicate expression name: '${name}'. Expression names must be unique.`
        )
      }
      expressionsMap.set(name, expr)
    }

    const batch = parseBatch(this.opts, this.engine, expressionsMap)

    this.state = {
      batch,
      originalExpressions: expressionsMap,
      lastContext: Object.create(null),
      cachedResults: {},
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

    const newResults = evaluateBatch(
      this.state.batch,
      this.state.lastContext,
      dirtyExpressions
    )

    // Merge new results into cached results
    for (const [name, value] of Object.entries(newResults)) {
      this.state.cachedResults[name] = value
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
    this.state.originalExpressions.clear()
    this.state.batch.expressions.clear()
    this.state.batch.dependencyGraph.clear()
  }

  /**
   * Get dependency information.
   * @returns Map of context key → list of expression names that depend on it
   */
  getDependencies(): Map<string, string[]> {
    const deps = new Map<string, string[]>()
    for (const [key, entries] of this.state.batch.dependencyGraph) {
      deps.set(key, [...entries])
    }
    return deps
  }

  /**
   * Reset all results to undefined (for fresh evaluation without recompilation).
   */
  reset(): void {
    this.state.cachedResults = {}
  }

  /**
   * Add a new expression to the batch.
   *
   * This recompiles the entire batch (Phase 1–3: ref collection, dependency
   * graph, evaluable parsing). Cached results for existing expressions are
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

    this.recompile()
  }

  /**
   * Recompile the batch from stored original expressions.
   */
  private recompile(): void {
    const batch = parseBatch(
      this.opts,
      this.engine,
      this.state.originalExpressions
    )

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
   * Merge caller's context into stored context. Handles deletion via
   * undefined sentinel.
   */
  private mergeContext(ctx: Context): void {
    const map = new Map<string, ContextValue>(
      Object.entries(this.state.lastContext)
    )

    for (const [key, newVal] of Object.entries(ctx)) {
      if (key === '__proto__') {
        continue
      }
      if (newVal === undefined) {
        map.delete(key)
      } else {
        map.set(key, newVal)
      }
    }

    this.state.lastContext = Object.assign({}, Object.fromEntries(map))
  }
}
