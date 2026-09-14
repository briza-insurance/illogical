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
import { Context, Result } from '../common/evaluable.js';
import { ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { ChangeCallback, CompiledBatch } from './types.js';
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
    /** Change callbacks registered via onChange() */
    onChangeCallbacks: ChangeCallback[];
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
     * @param options — Expressions map and optional parser options
     */
    constructor(options: BatchEvaluatorOptions);
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
     * Subscribe to change notifications.
     * Callback fires only for expressions whose result changed.
     *
     * @param callback — Called with list of changed expressions
     * @returns Unsubscribe function
     */
    onChange(callback: ChangeCallback): () => void;
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
     * Note: This recompiles the entire batch.
     *
     * @param name — Expression name
     * @param expression — Raw expression input
     */
    addExpression(name: string, expression: ExpressionInput): void;
    /**
     * Remove an expression from the batch.
     * Note: This recompiles the entire batch.
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
