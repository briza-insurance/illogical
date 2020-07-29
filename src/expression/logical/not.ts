/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import { Context, Evaluable, Result } from '../../common/evaluable'
import { Value } from '../../operand/value'
import { Logical } from '.'

// Operator key
export const OPERATOR = Symbol('NOT')

/**
 * Not logical expression
 */
export class Not extends Logical {
  /**
   * @constructor
   * @param {Evaluable} operand
   */
  constructor(...args: Evaluable[]);
  constructor (operand: Evaluable) {
    if (arguments.length !== 1) {
      throw new Error('logical NOT expression must have exactly one operand')
    }
    super('NOT', [operand, new Value(false)])
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    const result = this.operands[0].evaluate(ctx)
    if (result !== true && result !== false) {
      throw new Error('logical NOT expression\'s operand must be evaluated to boolean value')
    }

    return !result
  }
}
