import { Context, Evaluable, EvaluableType, Result, SimplifyArgs } from '../../common/evaluable';
import { Operand } from '../../operand';
import { ExpressionInput } from '../../parser';
import { Options } from '../../parser/options';
/**
 * Abstract arithmetic expression
 */
export declare abstract class Arithmetic implements Evaluable {
    protected readonly operator: string;
    protected readonly operatorSymbol: symbol;
    protected readonly operands: Operand[];
    type: EvaluableType;
    /**
     * @constructor
     * @param {string} operator String representation of the operator.
     * @param {symbol} operatorSymbol Operator symbol.
     * @param {Operand[]} operands Operands.
     */
    constructor(operator: string, operatorSymbol: symbol, operands: Operand[]);
    /**
     * Performs the arithmetic operation on the operands evaluated values.
     * @param {Result[]} results Operand result values.
     * @returns {Result}
     */
    abstract operate(results: Result[]): Result;
    /**
     * {@link Evaluable.evaluate}
     */
    evaluate(ctx: Context): Result;
    /**
     * {@link Evaluable.toString}
     */
    toString(): string;
    /**
     * {@link Evaluable.simplify}
     */
    simplify(...args: SimplifyArgs): Result | Evaluable;
    /**
     * {@link Evaluable.serialize}
     */
    serialize(options: Options): ExpressionInput;
}
