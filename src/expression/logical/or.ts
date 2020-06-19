/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import {
  Context,
  Result,
  Evaluable
} from '../../common/evaluable'

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
  constructor (operands: Evaluable[]) {
    if (operands.length < 2) {
      throw new Error('logical expression must have at least two operands')
    }
    super('OR', operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    for (const operand of this.operands) {
      if (operand.evaluate(ctx) === true) {
        return true
      }
    }
    return false
  }
}
