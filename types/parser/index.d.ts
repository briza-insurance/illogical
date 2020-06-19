/**
 * Parser module.
 * @module illogical/parser
 */
import { Options } from './options';
import { Evaluable } from '../common/evaluable';
declare type operand = string | number | boolean | null | Array<string | number | boolean>;
export declare type ExpressionRaw = ComparisonRaw | PredicateRaw | LogicalRaw;
export declare type ComparisonRaw = [string, operand, operand];
export declare type PredicateRaw = [string, operand];
export declare type LogicalRaw = [string, ...Array<ComparisonRaw | PredicateRaw | operand[]>];
/**
 * Void expression
 * Used in the reduction process to eliminate.
 * void redundant expressions.
 */
export declare class VoidExpression implements Evaluable {
    /**
     * Evaluate in the given context.
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
    get options(): Options;
    /**
     * Parse raw expression into evaluable expression.
     * @param {ExpressionRaw} raw Raw expression.
     * @return {Evaluable}
     */
    parse(raw: ExpressionRaw): Evaluable;
    /**
     * Parse raw expression based on the expression type.
     * @param raw
     */
    private parseRawExp;
    /**
     * Parse raw logical expression.
     * @param {LogicalRaw} raw Raw expression.
     * @return {Logical|Comparison|null}
     */
    private parseLogicalRawExp;
    /**
     * Parse raw predicate expression.
     * @param {PredicateRaw} raw Raw predicate expression.
     * @return {Comparison}
     */
    private parsePredicateRawExp;
    /**
     * Parse raw comparison expression.
     * @param {ComparisonRaw} raw Raw comparison expression.
     * @return {Comparison}
     */
    private parseComparisonRawExp;
    /**
     * Get resolved operand
     * @param raw Raw data
     */
    private getOperand;
}
export {};
