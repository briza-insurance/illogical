import { Context } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { BatchEvaluatorOptions } from './types.js';
export declare class BatchEngine {
    private engine;
    private state;
    private opts;
    /**
     * Create a new BatchEngine.
     *
     * Validates that all expression names in the initial expressions map are
     * unique. Throws a `TypeError` if any duplicate names are found.
     *
     * @param options — BatchEvaluatorOptions containing expressions and optional parser options
     * @throws TypeError if duplicate expression names are provided
     */
    constructor(options: BatchEvaluatorOptions);
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
     * @returns Record mapping expression names to their Result values
     */
    evaluate(ctx: Context): Record<string, boolean>;
    /**
     * Get the full results of all expressions.
     * @returns Record mapping expression names to their Result values
     */
    getResults(): Record<string, boolean>;
    /**
     * Retrieves the cached result for a specific expression.
     *
     * @param name Expression name to retrieve the result for
     * @returns The cached result for the specified expression, or undefined if it doesn't exist
     */
    getResultForExpression(name: string): boolean | undefined;
    /**
     * Dispose the batch evaluator — frees internal caches.
     */
    dispose(): void;
    /**
     * Reset all results to undefined (for fresh evaluation without reparsing).
     */
    reset(): void;
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
    addExpression(name: string, expression: ExpressionInput): void;
    /**
     * Remove an expression from the batch.
     *
     * This reparses the entire batch. The removed expression's cached result is
     * cleared, and the expression is excluded from future evaluations. Other
     * expressions' cached results are preserved.
     *
     * @param name — Expression name to remove
     */
    removeExpression(name: string): void;
    /**
     * Reparse the batch from stored original expressions.
     */
    private reparse;
    /**
     * Merge caller's context into stored context. Handles deletion via
     * undefined sentinel.
     */
    private mergeContext;
}
