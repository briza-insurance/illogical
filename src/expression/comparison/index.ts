import {
  Context,
  Evaluable,
  EvaluableType,
  Result,
  SimplifyArgs,
} from '../../common/evaluable'
import {
  isEvaluable,
  isSimplifiedArithmeticExpression,
} from '../../common/type-check'
import { Operand } from '../../operand'
import { Value } from '../../operand/value'
import { ExpressionInput } from '../../parser'
import { Options } from '../../parser/options'

/**
 * Abstract comparison expression
 */
export abstract class Comparison implements Evaluable {
  type: EvaluableType = EvaluableType.Expression

  /**
   * @constructor
   * @param {string} operator String representation of the operator.
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor(
    protected readonly operator: string,
    protected readonly operatorSymbol: symbol,
    protected readonly left: Operand,
    protected readonly right: Operand
  ) {}

  /**
   * {@link Evaluable.evaluate}
   */
  evaluate(ctx: Context): Result {
    return this.comparison(this.left.evaluate(ctx), this.right.evaluate(ctx))
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString(): string {
    return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`
  }

  /**
   * Compares left and right operands evaluated values.
   * @param {Result} left left operand result value
   * @param {Result} right right operand result value
   * @returns {boolean}
   */
  abstract comparison(left: Result, right: Result): boolean

  /**
   * {@link Evaluable.simplify}
   */
  simplify(...args: SimplifyArgs): Result | Evaluable {
    const left = this.left.simplify(...args)
    const right = this.right.simplify(...args)
    if (!isEvaluable(left) && !isEvaluable(right)) {
      return this.comparison(left, right)
    }

    if (
      isEvaluable(left) &&
      isSimplifiedArithmeticExpression(this.right, right)
    ) {
      return Reflect.construct(this.constructor, [left, new Value(right)])
    }

    if (
      isEvaluable(right) &&
      isSimplifiedArithmeticExpression(this.left, left)
    ) {
      return Reflect.construct(this.constructor, [new Value(left), right])
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
      this.left.serialize(options),
      this.right.serialize(options),
    ]
  }
}
