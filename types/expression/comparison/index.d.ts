/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */
import { Context, Evaluable, EvaluableType, Result } from '../../common/evaluable';
import { Operand } from '../../operand';
import { ExpressionInput } from '../../parser';
import { Options } from '../../parser/options';
/**
 * Abstract comparison expression
 */
export declare abstract class Comparison implements Evaluable {
    protected readonly operator: string;
    protected readonly operatorSymbol: symbol;
    protected readonly left: Operand;
    protected readonly right: Operand;
    type: EvaluableType;
    /**
     * @constructor
     * @param {string} operator String representation of the operator.
     * @param {Operand} left Left operand.
     * @param {Operand} right Right operand.
     */
    constructor(operator: string, operatorSymbol: symbol, left: Operand, right: Operand);
    /**
     * Evaluate in the given context.
     * @param {Context} ctx
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
    abstract comparison(left: Result, right: Result): boolean;
    simplify(...args: [Context]): Result | Evaluable;
    serialize(options: Options): ExpressionInput;
}
