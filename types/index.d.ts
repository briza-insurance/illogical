/**
 * Main module.
 * @module illogical
 */
import type { BatchEvaluatorOptions } from './batch/index.js';
import { BatchEvaluator } from './batch/index.js';
import { BytecodeEvaluable } from './bytecode/evaluable.js';
import { Context } from './common/evaluable.js';
import { isBoolean } from './common/type-check.js';
import { OPERATOR_AND, OPERATOR_DIVIDE, OPERATOR_EQ, OPERATOR_GE, OPERATOR_GT, OPERATOR_IN, OPERATOR_LE, OPERATOR_LT, OPERATOR_MULTIPLY, OPERATOR_NE, OPERATOR_NOR, OPERATOR_NOT, OPERATOR_NOT_IN, OPERATOR_OR, OPERATOR_OVERLAP, OPERATOR_PREFIX, OPERATOR_PRESENT, OPERATOR_SUBTRACT, OPERATOR_SUFFIX, OPERATOR_SUM, OPERATOR_UNDEFINED, OPERATOR_XOR } from './operator.js';
import { ExpressionInput, Input } from './parser/index.js';
import { Options } from './parser/options.js';
export { defaultOptions } from './parser/options.js';
export { isBoolean, OPERATOR_EQ, OPERATOR_NE, OPERATOR_GT, OPERATOR_GE, OPERATOR_LT, OPERATOR_LE, OPERATOR_IN, OPERATOR_NOT_IN, OPERATOR_PREFIX, OPERATOR_SUFFIX, OPERATOR_OVERLAP, OPERATOR_UNDEFINED, OPERATOR_PRESENT, OPERATOR_AND, OPERATOR_OR, OPERATOR_NOR, OPERATOR_XOR, OPERATOR_NOT, OPERATOR_DIVIDE, OPERATOR_MULTIPLY, OPERATOR_SUBTRACT, OPERATOR_SUM, };
export type { Context, ExpressionInput, Input, Options };
export type { BatchEvaluator, BatchEvaluatorOptions } from './batch/index.js';
/**
 * Condition engine — bytecode-only evaluator.
 * Expressions are compiled to bytecode and interpreted at runtime.
 */
declare class Engine {
    private readonly parserOptions;
    private readonly bytecodeCache;
    /**
     * @constructor
     * @param {Partial<Options>?} options Parser options.
     */
    constructor(options?: Partial<Options>);
    private getCompiled;
    /**
     * Evaluate the expression.
     * @param {ExpressionInput} exp Raw expression.
     * @param {Context} ctx Evaluation data context.
     * @return {boolean}
     */
    evaluate(exp: ExpressionInput, ctx: Context): boolean;
    /**
     * Parse expression into a bytecode-evaluable wrapper.
     * @param {ExpressionInput} exp Raw expression.
     * @return {BytecodeEvaluable}
     */
    parse(exp: ExpressionInput): BytecodeEvaluable;
    /**
     * Simplifies an expression with values in context.
     *
     * This method tries to evaluate all the expressions and reduce them to its corresponding boolean value.
     * If a value required for the expression is not present in the context, the minimal corresponding expression
     * will be returned.
     *
     * @param {ExpressionInput} exp  Raw expression.
     * @param {Context} context Evaluation data context.
     * @param {string[] | Set<string>} strictKeys keys to be considered present even if they are not present in the
     *  context. Passing as a Set is recommended for performance reasons.
     * @param {string[] | Set<string>} optionalKeys keys to be considered not present unless they are in the context or in
     *  `strictKeys`; when `strictKeys` is `undefined` and `optionalKeys` is an array, every key that is not in
     *  `optionalKeys` is considered to be present and thus will be evaluated. Passing as a Set is recommended for
     *  performance reasons.
     * @returns {Input | boolean}
     */
    simplify(exp: ExpressionInput, context: Context, strictKeys?: string[] | Set<string>, optionalKeys?: string[] | Set<string>): Input | boolean;
    /**
     * Create a BatchEvaluator for evaluating multiple expressions with shared resources.
     *
     * The batch evaluator compiles all expressions once, shares refs/consts across them,
     * and supports incremental evaluation based on trusted dirty keys.
     *
     * @param {BatchEvaluatorOptions} options — Expressions map and optional parser options
     * @returns {BatchEvaluator}
     *
     * @example
     * ```typescript
     * const batch = engine.createBatchEvaluator({
     *   expressions: {
     *     isActive: ['==', '$status', 'active'],
     *     isPremium: ['==', '$tier', 'premium'],
     *   },
     * })
     *
     * const results = batch.evaluate({ status: 'active', tier: 'premium' })
     * // Mode 2: incremental with trusted dirty keys
     * const updated = batch.evaluate(fullContext, ['status'])
     * ```
     */
    createBatchEvaluator(options: BatchEvaluatorOptions): BatchEvaluator;
}
export default Engine;
