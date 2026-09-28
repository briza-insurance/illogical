import { Context, Evaluable } from '../common/evaluable.js';
import { ExpressionInput, Input } from '../parser/index.js';
import { Options } from '../parser/options.js';
/**
 * Condition engine
 */
export declare class Engine {
    private readonly parser;
    /**
     * @constructor
     * @param {Options?} options Parser options.
     */
    constructor(options?: Partial<Options>);
    /**
     * Evaluate the expression.
     * @param {ExpressionInput} exp Raw expression.
     * @param {Context} ctx Evaluation data context.
     * @return {boolean}
     */
    evaluate(exp: ExpressionInput, ctx: Context): boolean;
    /**
     * Get expression statement
     * @param {ExpressionInput} exp Raw expression.
     * @return {string}
     */
    statement(exp: ExpressionInput): string;
    /**
     * Parse expression.
     * @param {ExpressionInput} exp Raw expression.
     * @return {Evaluable}
     */
    parse(exp: ExpressionInput): Evaluable;
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
     * @returns {Inpunt | boolean}
     */
    simplify(exp: ExpressionInput, context: Context, strictKeys?: string[] | Set<string>, optionalKeys?: string[] | Set<string>): Input | boolean;
}
