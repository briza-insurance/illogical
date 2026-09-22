import { Evaluable } from '../common/evaluable.js';
import { Options } from './options.js';
export type Input = string | number | boolean | null | Input[] | [string, ...Input[]] | Record<string, unknown>;
export type ArrayInput = Input[];
export type ExpressionInput = [string, ...Input[]];
/**
 * Parser of raw expressions into Evaluable expression
 */
export declare class Parser {
    private readonly opts;
    private readonly expectedRootOperators;
    private readonly unexpectedRootSymbols;
    private readonly referenceCache;
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
    private getReference;
    private resolve;
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
