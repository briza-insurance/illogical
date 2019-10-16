import { Options } from './options';
import { Evaluable } from '../common/evaluable';
import { Comparison } from '../expression/comparison';
import { Logical } from '../expression/logical';
declare type operand = string | number | boolean | null | string[] | number[];
export declare type ComparisonRaw = [string, operand, operand];
export declare type LogicalRaw = [string, ...Array<ComparisonRaw | operand[]>];
/**
 * Void expression
 * Used in the reduction process to eliminate
 * void redundant expressions.
 */
export declare class VoidExpression implements Evaluable {
    /**
     * Evaluate in the given context
     * @return {boolean}
     */
    evaluate(): boolean;
    /**
     * @return {string}
     */
    toString(): string;
}
/**
 * Parser of raw expressions into Evaluable expression
 */
export declare class Parser {
    private strict;
    private readonly opts;
    private readonly logicalOperator;
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
     * Parser options
     * @type {Options}
     */
    readonly options: Options;
    /**
     * Parse raw expression into evaluable expression
     * @param {ComparisonRaw | LogicalRaw} raw expression
     * @return {Evaluable}
     */
    parse(raw: ComparisonRaw | LogicalRaw): Evaluable;
    /**
     * Parse raw logical expression
     * @param {LogicalRaw} raw expression
     * @return {Logical|Comparison|null}
     */
    parseLogicalRawExp(raw: LogicalRaw): Logical | Comparison | Evaluable;
    /**
     * Parse raw comparison expression
     * @param {ComparisonRaw} raw
     * @return {Comparison}
     */
    parseComparisonRawExp(raw: ComparisonRaw): Comparison;
}
export {};
