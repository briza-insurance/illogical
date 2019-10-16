/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import {
  Context,
  Result
} from '../../common/evaluable'

import {
  Logical,
  Operand
} from '../logical'

// Operator key
export const OPERATOR = Symbol('AND')

/**
 * And logical expression
 */
export class And extends Logical {
  /**
   * @constructor
   * @param {Operand[]} operands Collection of operands.
   */
  constructor (operands: Operand[]) {
    super('AND', operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    for (const operand of this.operands) {
      if (operand.evaluate(ctx) === false) {
        return false
      }
    }
    return true
  }
}
