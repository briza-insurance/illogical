import { Result } from '../common/evaluable.js'
import { isString } from '../common/type-check.js'
import { Input } from '../parser/index.js'
import { Operand } from './index.js'

/**
 * Print value as string
 * @param {Result} value
 * @return {string}
 */
function printValue(value: Result): string {
  if (isString(value)) {
    return `"${value}"`
  }
  return `${value}`
}

/**
 * Static value operand
 */
export class Value extends Operand {
  private readonly value: Result

  /**
   * @constructor
   * @param {Result} value Constant value.
   */
  constructor(value: Result) {
    if (Array.isArray(value)) {
      throw new Error(
        'deprecated direct usage of array, please use Collection operand'
      )
    }
    super()
    this.value = value
  }

  /**
   * {@link Evaluable.evaluate}
   */
  evaluate(): Result {
    return this.value
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(): Result {
    return this.value
  }

  /**
   * {@link Evaluable.serialize}
   */
  serialize(): Input {
    return this.value as Input
  }

  /**
   * Get the strict representation of the operand.
   * @return {string}
   */
  toString(): string {
    return printValue(this.value)
  }
}
