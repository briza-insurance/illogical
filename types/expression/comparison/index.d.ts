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
     * {@link Evaluable.evaluate}
     */
    evaluate(ctx: Context): Result;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
    /**
     * Compares left and right operands evaluated values.
     * @param {Result} left left operand result value
     * @param {Result} right right operand result value
     * @returns {boolean}
     */
    abstract comparison(left: Result, right: Result): boolean;
    /**
     * {@link Evaluable.simplify}
     */
    simplify(...args: [Context, string[]]): Result | Evaluable;
    /**
     * {@link Evaluable.serialize}
     */
    serialize(options: Options): ExpressionInput;
}
