/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import { Context, Evaluable, Result } from '../../common/evaluable'
import { isBoolean, isEvaluable } from '../../common/type-check'
import { Logical } from '../logical'
import { Not } from './not'

// Operator key
export const OPERATOR = Symbol('NOR')

/**
 * Nor logical expression
 */
export class Nor extends Logical {
  /**
   * @constructor
   * @param {Evaluable[]} operands Collection of operands.
   */
  constructor (operands: Evaluable[]) {
    if (operands.length < 2) {
      throw new Error('logical expression must have at least two operands')
    }
    super('NOR', OPERATOR, operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    for (const operand of this.operands) {
      if (operand.evaluate(ctx) === true) {
        return false
      }
    }
    return true
  }

  simplify (...args: [Context, string[]]): boolean | Evaluable {
    const simplified = this.operands.reduce<Evaluable[] | boolean>((result, child) => {
      if (result !== false) {
        const childResult = child.simplify(...args)
        if (isEvaluable(childResult)) {
          if (isBoolean(result)) {
            return [child]
          }
          return [...result, child]
        }
        if (childResult) {
          return false
        }
      }
      return result
    }, true)

    if (Array.isArray(simplified)) {
      if (simplified.length === 1) {
        return new Not(...simplified)
      }
      return new Nor(simplified)
    }
    return simplified
  }
}
