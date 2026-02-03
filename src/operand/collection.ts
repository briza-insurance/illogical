import {
  Context,
  Evaluable,
  Result,
  SimplifyArgs,
} from '../common/evaluable.js'
import { isEvaluable } from '../common/type-check.js'
import { Input } from '../parser/index.js'
import { Options } from '../parser/options.js'
import { Operand } from './index.js'
import { Reference } from './reference.js'
import { Value } from './value.js'

/**
 * Collection operand resolved containing mixture of value and references.
 */
export class Collection extends Operand {
  private readonly items: Array<Value | Reference>

  /**
   * Get the items in the collection.
   * @returns {Array<Value | Reference>}
   */
  getItems(): Array<Value | Reference> {
    return this.items
  }

  /**
   * @constructor
   * @param {Operand[]} items Collection of operands.
   */
  constructor(items: Array<Value | Reference>) {
    super()
    this.items = items
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate(ctx: Context): Result {
    return this.items.map((item) => item.evaluate(ctx)) as []
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(...args: SimplifyArgs): Result | Evaluable {
    const values: Result[] = []
    for (const item of this.items) {
      const simplifiedItem = item.simplify(...args)
      if (isEvaluable(simplifiedItem)) {
        return this
      }
      values.push(simplifiedItem)
    }

    return values
  }

  /**
   * {@link Evaluable.serialize}
   */
  serialize(options: Options): Input {
    return this.items.map((item) =>
      isEvaluable(item) ? item.serialize(options) : item
    )
  }

  /**
   * Get the strict representation of the operand.
   * @return {string}
   */
  toString(): string {
    return '[' + this.items.map((item) => item.toString()).join(', ') + ']'
  }
}
