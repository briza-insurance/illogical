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
export const OPERATOR = Symbol('NOR')

/**
 * Nor logical expression
 */
export class Nor extends Logical {
  /**
   * @constructor
   * @param {Operand[]} operands Collection of operands.
   */
  constructor (operands: Operand[]) {
    super('NOR', operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    if (this.operands.length === 0) {
      throw new Error('logical expression must have at least one operand')
    }
    for (const operand of this.operands) {
      if (operand.evaluate(ctx)) {
        return false
      }
    }
    return true
  }
}
