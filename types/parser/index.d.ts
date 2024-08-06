import { Evaluable } from '../common/evaluable';
import { Options } from './options';
export type Input = string | number | boolean | null | Input[] | [string, ...Input[]];
export type ArrayInput = Input[];
export type ExpressionInput = [string, ...Input[]];
/**
 * Parser of raw expressions into Evaluable expression
 */
export declare class Parser {
    private readonly opts;
    private readonly expectedRootOperators;
    private readonly unexpectedRootSymbols;
    /**
     * @constructor
     * @param {Options?} options Parser options.
     */
    constructor(options?: Partial<Options>);
    /**
     * Parser options
     * @type {Options}
     */
    get options(): Options;
    /**
     * Parse raw expression into evaluable expression.
     * @param {ExpressionInput} raw Raw expression.
     * @return {Evaluable}
     */
    parse(raw: ExpressionInput): Evaluable;
    /**
     * Parse raw expression based on the expression type.
     * @param {Input} raw Raw expression.
     * @return {Evaluable}
     */
    private parseRawExp;
    /**
     * Get resolved operand
     * @param raw Raw data
     */
    private getOperand;
}
