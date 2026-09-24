import { Context, ContextValue } from '../common/evaluable.js'
import { Engine } from '../engine/engine.js'
import { ExpressionInput } from '../parser/index.js'
import { defaultOptions, Options } from '../parser/options.js'
import { findAffectedExpressions } from './dependency-graph.js'
import { evaluateBatch } from './evaluate.js'
import { parseBatch } from './parse.js'
import { BatchEvaluatorOptions, BatchEvaluatorState } from './types.js'

export class BatchEngine {
  private engine: Engine
  private state: BatchEvaluatorState
  private opts: Options

  /**
   * Create a new BatchEngine.
   *
   * @param options — BatchEvaluatorOptions containing expressions and optional parser options
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
    this.opts.collectEvaluableReferences = true

    this.engine = new Engine(this.opts)

    const batch = parseBatch(this.engine, options.expressions)

    this.state = {
      batch,
      expressions: options.expressions,
      lastContext: undefined,
      cachedResults: new WeakMap(),
      markedForEvaluation: [],
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
   *   - All affected expressions are re-evaluated in a single pass.
   *   - If Q2's expression references `$Q1` as a context key, changing Q1 will
   *     trigger re-evaluation of Q2 (via the dependency graph), but Q2 does not
   *     "depend on" Q1's result — it depends on the context key `Q1`.
   *
   * Mode 1 — No previous results: full evaluation of all expressions.
   *   Context is merged into stored context, all expressions run.
   *
   * Mode 2 — Subsequent evaluations with changed context: incremental evaluation.
   *   Only expressions affected by updated context are evaluated. The caller can
   *   choose to provide only the changed context. Keys which the value did not
   *   change are ignored. Sending undefined for a key indicates that the key has
   *   been removed from the context.
   *
   * @param ctx — Full evaluation context
   * @returns WeakMap mapping expression inputs (ExpressionInput) to their result values
   */
  evaluate(ctx: Context): WeakMap<ExpressionInput, boolean> {
    const inputKeys = Object.keys(ctx)

    const isFirstEvaluation = this.state.lastContext === undefined

    // No-op if no context was provided and it is not the first evaluation.
    if (inputKeys.length === 0 && !isFirstEvaluation) {
      return this.state.cachedResults
    }

    // Start with undefined, meaning all expressions will be evaluated if no
    // affected expressions are found.
    let affectedExpressions: ExpressionInput[] | undefined

    if (inputKeys.length > 0 && !isFirstEvaluation) {
      affectedExpressions = findAffectedExpressions(
        this.state.lastContext,
        ctx,
        this.state.batch.dependencyGraph
      )
    }

    if (
      // If affectedExpressions is undefined, full evaluation will already occur.
      // Otherwise, add expressions with dynamic refs to always be processed.
      affectedExpressions !== undefined &&
      this.state.batch.expressionsWithDynamic.length > 0
    ) {
      for (const expr of this.state.batch.expressionsWithDynamic) {
        affectedExpressions.push(expr)
      }
    }

    // If there are expressions marked for evaluation, add them to the affected
    // expressions set and clear the state.
    if (this.state.markedForEvaluation.length > 0) {
      if (affectedExpressions === undefined) {
        affectedExpressions = []
      }
      for (const expr of this.state.markedForEvaluation) {
        affectedExpressions.push(expr)
      }
      this.state.markedForEvaluation = []
    }

    if (affectedExpressions !== undefined && affectedExpressions.length === 0) {
      return this.state.cachedResults
    }

    this.state.lastContext = this.mergeContext(this.state.lastContext, ctx)

    // Merge new results into cached results
    for (const [expr, value] of evaluateBatch(
      this.state.expressions,
      this.state.batch,
      this.state.lastContext,
      affectedExpressions
    )) {
      this.state.cachedResults.set(expr, value)
    }

    return this.state.cachedResults
  }

  /**
   * Get the full results of all expressions.
   * @returns Record mapping expression names to their Result values
   */
  getResults(): WeakMap<ExpressionInput, boolean> {
    return this.state.cachedResults
  }

  /**
   * Retrieves the cached result for a specific expression.
   *
   * @param expression Expression to retrieve the result for
   * @returns The cached result for the specified expression, or undefined if it doesn't exist
   */
  getResultForExpression(expression: ExpressionInput): boolean | undefined {
    return this.state.cachedResults.get(expression)
  }

  /**
   * Dispose the batch evaluator — frees internal caches.
   */
  dispose(): void {
    this.state.cachedResults = new WeakMap()
    this.state.lastContext = undefined
    this.state.expressions = []
    this.state.batch.expressions = new WeakMap()
    this.state.batch.dependencyGraph.clear()
    this.state.markedForEvaluation = []
  }

  /**
   * Reset all results to undefined (for fresh evaluation without reparsing).
   */
  reset(): void {
    this.state.cachedResults = new WeakMap()
  }

  /**
   * Add a new expression to the batch.
   *
   * This reparses the entire batch . Cached results for existing expressions
   * are preserved — The newly added expression will be marked for evaluation.
   *
   * @param name — Expression name (must be unique; throws if already exists)
   * @param expression — Raw expression input
   * @throws TypeError if an expression with this name already exists
   */
  addExpression(expression: ExpressionInput): void {
    this.state.expressions.push(expression)
    this.state.markedForEvaluation.push(expression)

    this.reparse()
  }

  /**
   * Remove an expression from the batch.
   *
   * This reparses the entire batch. The removed expression's cached result is
   * cleared, and the expression is excluded from future evaluations. Other
   * expressions' cached results are preserved.
   *
   * @param expression — Expression to remove
   */
  removeExpression(expression: ExpressionInput): void {
    this.state.expressions = this.state.expressions.filter(
      (expr) => expr !== expression
    )
    this.state.cachedResults.delete(expression)

    this.reparse()
  }

  /**
   * Reparse the batch from stored original expressions.
   */
  private reparse(): void {
    this.state.batch = parseBatch(this.engine, this.state.expressions)
  }

  /**
   * Merge caller's context into stored context. Handles deletion via
   * undefined sentinel.
   */
  private mergeContext(
    lastContext: Context | undefined,
    ctx: Context
  ): Context {
    const map = new Map<string, ContextValue>(Object.entries(lastContext ?? {}))

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

    return Object.assign({}, Object.fromEntries(map))
  }
}
