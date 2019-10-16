/**
 * Operand module.
 * @module illogical/operand
 */

import {
  Evaluable,
  Context,
  Result
} from '../common/evaluable'

/**
 * Abstract operand
 */
export abstract class Operand implements Evaluable {
  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   */
  evaluate (ctx: Context): Result {
    throw new Error('not implemented exception')
  }

  /**
   * Get the strict representation.
   */
  toString (): string {
    throw new Error('not implemented exception')
  }
}