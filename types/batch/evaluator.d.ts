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
 *   getDependencies() — Map<string, string[]> mapping key → expression names
 *   reset() — clear results
 *   addExpression(name, expression) — add a new expression
 *   removeExpression(name) — remove an expression
 */
import { Context, Result } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { CompiledBatch } from './types.js';
/**
 * Options for creating a BatchEvaluator.
 */
export interface BatchEvaluatorOptions {
    /** Map of expression name → raw expression input */
    expressions: Record<string, ExpressionInput>;
    /** Optional parser options shared across all expressions */
    options?: Partial<Options>;
}
/**
 * State maintained by the BatchEvaluator.
 */
export interface BatchEvaluatorState {
    /** The compiled batch with shared resources */
    batch: CompiledBatch;
    /** Original expressions map — stored for addExpression/removeExpression */
    originalExpressions: Map<string, ExpressionInput>;
    /** Last full context passed to evaluate() */
    lastContext: Context;
    /** Cached results from the last evaluation */
    cachedResults: Record<string, Result>;
}
/**
 * BatchEvaluator — compiles many expressions once, evaluates incrementally.
 */
export declare class BatchEvaluator {
    private state;
    private opts;
    /**
     * Create a new BatchEvaluator.
     *
     * Validates that all expression names in the initial expressions map are
     * unique. Throws a `TypeError` if any duplicate names are found.
     *
     * @param options — Expressions map and optional parser options
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
    evaluate(ctx: Context, changedKeys?: string[]): Record<string, Result>;
    /**
     * Get the full results of all expressions.
     * @returns Record mapping expression names to their Result values
     */
    getResults(): Record<string, Result>;
    /**
     * Dispose the batch evaluator — frees internal caches.
     */
    dispose(): void;
    /**
     * Get dependency information.
     * @returns Map of context key → list of expression names that depend on it
     */
    getDependencies(): Map<string, string[]>;
    /**
     * Reset all results to undefined (for fresh evaluation without recompilation).
     */
    reset(): void;
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
    addExpression(name: string, expression: ExpressionInput): void;
    /**
     * Remove an expression from the batch.
     *
     * This recompiles the entire batch (Phase 1–3). The removed expression's
     * cached result is cleared, and the expression is excluded from future
     * evaluations. Other expressions' cached results are preserved.
     *
     * @param name — Expression name to remove
     */
    removeExpression(name: string): void;
    /**
     * Recompile the batch from stored original expressions.
     */
    private recompile;
    /**
     * Merge caller's context into stored context.
     * Handles deletion via undefined sentinel.
     */
    private mergeContext;
}
