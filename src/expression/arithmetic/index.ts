import {
  Context,
  Evaluable,
  EvaluableType,
  Result,
  SimplifyArgs,
} from '../../common/evaluable.js'
import { areAllNumbers, areAllResults } from '../../common/type-check.js'
import { Operand } from '../../operand/index.js'
import { ExpressionInput } from '../../parser/index.js'
import { Options } from '../../parser/options.js'

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
   * Helper function to assist with arithmetic evaluation. Ensures that all
   * operands are present and are numbers. Throws error if any operand is not a
   * number.
   *
   * @param {Result[]} results
   * @returns {number[] | false} false if any operand is missing, otherwise the
   *   array of numbers
   */
  protected getResultValues(results: Result[]): number[] | false {
    const presentValues = results.filter(
      (result) => result !== null && result !== undefined
    )
    // If we have missing context values the result must be false
    if (presentValues.length !== results.length) {
      return false
    }

    if (!areAllNumbers(presentValues)) {
      throw new Error(`operands must be numbers for ${this.constructor.name}`)
    }

    return presentValues
  }

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
