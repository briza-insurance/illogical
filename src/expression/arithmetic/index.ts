import {
  Context,
  Evaluable,
  EvaluableType,
  Result,
  SimplifyArgs,
} from '../../common/evaluable'
import { areAllResults } from '../../common/type-check'
import { Operand } from '../../operand'
import { ExpressionInput } from '../../parser'
import { Options } from '../../parser/options'

/**
 * Abstract arithmetic expression
 */
export abstract class Arithmetic implements Evaluable {
  type: EvaluableType = EvaluableType.Expression

  /**
   * @constructor
   * @param {string} operator String representation of the operator.
   * @param {symbol} operatorSymbol Operator symbol.
   * @param {Operand[]} operands Operands.
   */
  constructor(
    protected readonly operator: string,
    protected readonly operatorSymbol: symbol,
    protected readonly operands: Operand[]
  ) {}

  /**
   * Performs the arithmetic operation on the operands evaluated values.
   * @param {Result[]} results Operand result values.
   * @returns {Result}
   */
  abstract operate(results: Result[]): Result

  /**
   * {@link Evaluable.evaluate}
   */
  evaluate(ctx: Context): Result {
    return this.operate(this.operands.map((operand) => operand.evaluate(ctx)))
  }

  /**
   * {@link Evaluable.toString}
   */
  toString(): string {
    return `(${this.operands
      .map((operand) => operand.toString())
      .join(` ${this.operator} `)})`
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(...args: SimplifyArgs): Result | Evaluable {
    const results = this.operands.map((operand) => operand.simplify(...args))
    if (areAllResults(results)) {
      return this.operate(results)
    }
    return this
  }

  /**
   * {@link Evaluable.serialize}
   */
  serialize(options: Options): ExpressionInput {
    const { operatorMapping } = options
    const operator = operatorMapping.get(this.operatorSymbol)
    if (operator === undefined) {
      throw new Error(`missing operator ${this.operatorSymbol.toString()}`)
    }
    return [
      operator,
      ...this.operands.map((operand) => operand.serialize(options)),
    ]
  }
}
