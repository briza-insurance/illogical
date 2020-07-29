/**
 * Operand module.
 * @module illogical/operand
 */

import { Context, Evaluable, EvaluableType, Result } from '../common/evaluable'

/**
 * Abstract operand
 */
export abstract class Operand implements Evaluable {
  type: EvaluableType = EvaluableType.Operand

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   */
  evaluate (ctx: Context): Result { // eslint-disable-line @typescript-eslint/no-unused-vars
    throw new Error('not implemented exception')
  }

  /**
   * Get the strict representation.
   */
  toString (): string {
    throw new Error('not implemented exception')
  }
}
