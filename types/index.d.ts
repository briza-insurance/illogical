/**
 * Main module.
 * @module illogical
 */
import { Context, Evaluable } from './common/evaluable';
import { isEvaluable } from './common/type-check';
import { OPERATOR as OPERATOR_DIVIDE } from './expression/arithmetic/divide';
import { OPERATOR as OPERATOR_MULTIPLY } from './expression/arithmetic/multiply';
import { OPERATOR as OPERATOR_SUBTRACT } from './expression/arithmetic/subtract';
import { OPERATOR as OPERATOR_SUM } from './expression/arithmetic/sum';
import { OPERATOR as OPERATOR_EQ } from './expression/comparison/eq';
import { OPERATOR as OPERATOR_GE } from './expression/comparison/ge';
import { OPERATOR as OPERATOR_GT } from './expression/comparison/gt';
import { OPERATOR as OPERATOR_IN } from './expression/comparison/in';
import { OPERATOR as OPERATOR_LE } from './expression/comparison/le';
import { OPERATOR as OPERATOR_LT } from './expression/comparison/lt';
import { OPERATOR as OPERATOR_NE } from './expression/comparison/ne';
import { OPERATOR as OPERATOR_NOT_IN } from './expression/comparison/not-in';
import { OPERATOR as OPERATOR_OVERLAP } from './expression/comparison/overlap';
import { OPERATOR as OPERATOR_PREFIX } from './expression/comparison/prefix';
import { OPERATOR as OPERATOR_PRESENT } from './expression/comparison/present';
import { OPERATOR as OPERATOR_SUFFIX } from './expression/comparison/suffix';
import { OPERATOR as OPERATOR_UNDEFINED } from './expression/comparison/undefined';
import { OPERATOR as OPERATOR_AND } from './expression/logical/and';
import { OPERATOR as OPERATOR_NOR } from './expression/logical/nor';
import { OPERATOR as OPERATOR_NOT } from './expression/logical/not';
import { OPERATOR as OPERATOR_OR } from './expression/logical/or';
import { OPERATOR as OPERATOR_XOR } from './expression/logical/xor';
import { ExpressionInput, Input } from './parser';
import { Options } from './parser/options';
export { defaultOptions } from './parser/options';
export { isEvaluable, OPERATOR_EQ, OPERATOR_NE, OPERATOR_GT, OPERATOR_GE, OPERATOR_LT, OPERATOR_LE, OPERATOR_IN, OPERATOR_NOT_IN, OPERATOR_PREFIX, OPERATOR_SUFFIX, OPERATOR_OVERLAP, OPERATOR_UNDEFINED, OPERATOR_PRESENT, OPERATOR_AND, OPERATOR_OR, OPERATOR_NOR, OPERATOR_XOR, OPERATOR_NOT, OPERATOR_DIVIDE, OPERATOR_MULTIPLY, OPERATOR_SUBTRACT, OPERATOR_SUM, };
export type { Context, Evaluable, ExpressionInput };
/**
 * Condition engine
 */
declare class Engine {
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
export default Engine;
