import {
  Context,
  Evaluable,
  EvaluableType,
  Result,
} from '../../common/evaluable.js'
import { ExpressionInput } from '../../parser/index.js'
import { Options } from '../../parser/options.js'

/**
 * Abstract logical expression
 */
export abstract class Logical implements Evaluable {
  type: EvaluableType = EvaluableType.Expression

  /**
   * @constructor
   * @param {string} operator String representation of the operator.
   * @param {Evaluable[]} operands Collection of operands.
   */
  constructor(
    protected readonly operator: string,
    protected readonly operatorSymbol: symbol,
    protected readonly operands: Evaluable[]
  ) {}

  /**
   * {@link Evaluable.evaluate}
   */
  abstract evaluate(ctx: Context): Result

  /**
   * {@link Evaluable.simplify}
   */
  abstract simplify(
    ctx: Context,
    strictKeys?: string[] | Set<string>,
    optionalKeys?: string[] | Set<string>
  ): Result | Evaluable

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString(): string {
    return (
      '(' +
      this.operands
        .map((operand) => operand.toString())
        .join(` ${this.operator} `) +
      ')'
    )
  }

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
