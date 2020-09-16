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

  abstract evaluate (ctx: Context): Result

  abstract simplify(ctx: Context): Result | Evaluable

  /**
   * Get the strict representation.
   */
  toString (): string {
    throw new Error('not implemented exception')
  }
}
