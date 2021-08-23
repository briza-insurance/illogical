import {
  Context,
  Evaluable,
  Result,
  SimplifyArgs,
} from '../../common/evaluable'
import { isBoolean, isEvaluable } from '../../common/type-check'
import { Logical } from '../logical'

// Operator key
export const OPERATOR = Symbol('OR')

/**
 * Or logical expression
 */
export class Or extends Logical {
  /**
   * @constructor
   * @param {Evaluable[]} operands Collection of operands.
   */
  constructor(operands: Evaluable[]) {
    if (operands.length < 2) {
      throw new Error('logical expression must have at least two operands')
    }
    super('OR', OPERATOR, operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate(ctx: Context): Result {
    for (const operand of this.operands) {
      if (operand.evaluate(ctx) === true) {
        return true
      }
    }
    return false
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(...args: SimplifyArgs): boolean | Evaluable {
    const simplified = this.operands.reduce<Evaluable[] | boolean>(
      (result, child) => {
        if (result !== true) {
          const childResult = child.simplify(...args)

          if (isEvaluable(childResult)) {
            if (isBoolean(result)) {
              return [childResult]
            }
            return [...result, childResult]
          }

          if (childResult) {
            return true
          }
        }
        return result
      },
      false
    )
    if (Array.isArray(simplified)) {
      if (simplified.length === 1) {
        return simplified[0]
      }
      return new Or(simplified)
    }
    return simplified
  }
}
