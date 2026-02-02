import {
  Context,
  Evaluable,
  EvaluableType,
  Result,
} from '../common/evaluable.js'
import { Input } from '../parser/index.js'
import { Options } from '../parser/options.js'

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
  abstract simplify(
    ctx: Context,
    strictKeys?: string[] | Set<string>,
    optionalKeys?: string[] | Set<string>
  ): Result | Evaluable

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
