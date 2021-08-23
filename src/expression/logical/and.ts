import {
  Context,
  Evaluable,
  Result,
  SimplifyArgs,
} from '../../common/evaluable'
import { isBoolean, isEvaluable } from '../../common/type-check'
import { Logical } from '../logical'

// Operator key
export const OPERATOR = Symbol('AND')

/**
 * And logical expression
 */
export class And extends Logical {
  /**
   * @constructor
   * @param {Evaluable[]} operands Collection of operands.
   */
  constructor(operands: Evaluable[]) {
    if (operands.length < 2) {
      throw new Error('logical expression must have at least two operands')
    }
    super('AND', OPERATOR, operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate(ctx: Context): Result {
    for (const operand of this.operands) {
      if (operand.evaluate(ctx) === false) {
        return false
      }
    }
    return true
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(...args: SimplifyArgs): boolean | Evaluable {
    const simplified = this.operands.reduce<boolean | Evaluable[]>(
      (result, child) => {
        if (result !== false) {
          const childResult = child.simplify(...args)
          if (isEvaluable(childResult)) {
            if (isBoolean(result)) {
              return [childResult]
            }
            return [...result, childResult]
          }
          if (!childResult) {
            return false
          }
        }
        return result
      },
      true
    )
    if (Array.isArray(simplified)) {
      if (simplified.length === 1) {
        return simplified[0]
      }
      return new And(simplified)
    }
    return simplified
  }
}
