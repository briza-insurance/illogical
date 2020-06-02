/**
 * Parser module.
 * @module illogical/parser
 */
import { Options } from './options';
import { Evaluable } from '../common/evaluable';
import { Comparison } from '../expression/comparison';
import { Predicate } from '../expression/predicate';
declare type operand = string | number | boolean | null | string[] | number[];
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
     * Parse raw expression
     * @param raw
     */
    parseRawExp(raw: ExpressionRaw): Evaluable;
    /**
     * Parse raw logical expression.
     * @param {LogicalRaw} raw Raw expression.
     * @return {Logical|Comparison|null}
     */
    parseLogicalRawExp(raw: LogicalRaw): Evaluable;
    /**
     * Parse raw predicate expression.
     * @param {PredicateRaw} raw Raw predicate expression.
     * @return {Comparison}
     */
    parsePredicateRawExp(raw: PredicateRaw): Predicate;
    /**
     * Parse raw comparison expression.
     * @param {ComparisonRaw} raw Raw comparison expression.
     * @return {Comparison}
     */
    parseComparisonRawExp(raw: ComparisonRaw): Comparison;
}
export {};
