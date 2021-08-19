import { Context, Evaluable, EvaluableType, Result } from '../common/evaluable'
import { Input } from '../parser'
import { Options } from '../parser/options'

/**
 * Abstract operand
 */
export abstract class Operand implements Evaluable {
  type: EvaluableType = EvaluableType.Operand

  /**
   * {@link Evaluable.evaluate}
   */
  abstract evaluate(ctx: Context): Result

  /**
   * {@link Evaluable.simplify}
   */
  abstract simplify(ctx: Context, ignoreKeys: string[]): Result | Evaluable

  /**
   * {@link Evaluable.serialize}
   */
  abstract serialize(options: Options): Input

  /**
   * Get the strict representation.
   */
  toString(): string {
    throw new Error('not implemented exception')
  }
}
