import { Context, Evaluable, EvaluableType, Result } from '../../common/evaluable';
import { ExpressionInput } from '../../parser';
import { Options } from '../../parser/options';
/**
 * Abstract logical expression
 */
export declare abstract class Logical implements Evaluable {
    protected readonly operator: string;
    protected readonly operatorSymbol: symbol;
    protected readonly operands: Evaluable[];
    type: EvaluableType;
    /**
     * @constructor
     * @param {string} operator String representation of the operator.
     * @param {Evaluable[]} operands Collection of operands.
     */
    constructor(operator: string, operatorSymbol: symbol, operands: Evaluable[]);
    /**
     * {@link Evaluable.evaluate}
     */
    abstract evaluate(ctx: Context): Result;
    /**
     * {@link Evaluable.simplify}
     */
    abstract simplify(ctx: Context, strictKeys?: false | string[], optionalKeys?: false | string[]): Result | Evaluable;
    /**
     * Get the strict representation of the expression.
     * @return {string}
     */
    toString(): string;
    serialize(options: Options): ExpressionInput;
}
