/**
 * Main module.
 * @module illogical
 */
import { ComparisonRaw, LogicalRaw } from './parser';
import { Options } from './parser/options';
import { Context, Evaluable } from './common/evaluable';
import { OPERATOR as OPERATOR_EQ } from './expression/comparison/eq';
import { OPERATOR as OPERATOR_NE } from './expression/comparison/ne';
import { OPERATOR as OPERATOR_GT } from './expression/comparison/gt';
import { OPERATOR as OPERATOR_GE } from './expression/comparison/ge';
import { OPERATOR as OPERATOR_LT } from './expression/comparison/lt';
import { OPERATOR as OPERATOR_LE } from './expression/comparison/le';
import { OPERATOR as OPERATOR_IN } from './expression/comparison/in';
import { OPERATOR as OPERATOR_NOT_IN } from './expression/comparison/not-in';
import { OPERATOR as OPERATOR_PREFIX } from './expression/comparison/prefix';
import { OPERATOR as OPERATOR_SUFFIX } from './expression/comparison/suffix';
import { OPERATOR as OPERATOR_AND } from './expression/logical/and';
import { OPERATOR as OPERATOR_OR } from './expression/logical/or';
import { OPERATOR as OPERATOR_NOR } from './expression/logical/nor';
import { OPERATOR as OPERATOR_XOR } from './expression/logical/xor';
export { OPERATOR_EQ, OPERATOR_NE, OPERATOR_GT, OPERATOR_GE, OPERATOR_LT, OPERATOR_LE, OPERATOR_IN, OPERATOR_NOT_IN, OPERATOR_PREFIX, OPERATOR_SUFFIX, OPERATOR_AND, OPERATOR_OR, OPERATOR_NOR, OPERATOR_XOR };
/**
 * Condition engine
 */
declare class Engine {
    private readonly parser;
    /**
     * @constructor
     * @param {boolean} strict In non-strict mode the parser
     * can perform some expression reduction to optimize the
     * expression. The string from than does not have to have
     * the same structure as the raw expression.
     * @param {Options?} options Parser options.
     */
    constructor(strict?: boolean, options?: Partial<Options>);
    /**
     * Evaluate the expression.
     * @param {ComparisonRaw | LogicalRaw} exp Raw expression.
     * @param {Context} ctx Evaluation data context.
     * @return {boolean}
     */
    evaluate(exp: ComparisonRaw | LogicalRaw, ctx: Context): boolean;
    /**
     * Get expression statement
     * @param {ComparisonRaw | LogicalRaw} exp Raw expression.
     * @return {string}
     */
    statement(exp: ComparisonRaw | LogicalRaw): string;
    /**
     * Parse expression.
     * @param {ComparisonRaw | LogicalRaw} exp Raw expression.
     * @return {Evaluable}
     */
    parse(exp: ComparisonRaw | LogicalRaw): Evaluable;
}
export default Engine;
