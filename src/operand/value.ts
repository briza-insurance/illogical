/**
 * Operand module.
 * @module illogical/operand
 */

import { Result } from '../common/evaluable'
import { isString } from '../common/type-check'
import { Input } from '../parser'
import { Operand } from '.'

/**
 * Print value as string
 * @param {Result} value
 * @return {string}
 */
function printValue (value: Result): string {
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
  constructor (value: Result) {
    if (Array.isArray(value)) {
      throw new Error('deprecated direct usage of array, please use Collection operand')
    }
    super()
    this.value = value
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate (): Result {
    return this.value
  }

  simplify (): Result {
    return this.value
  }

  serialize (): Input {
    return this.value as Input
  }

  /**
   * Get the strict representation of the operand.
   * @return {string}
   */
  toString (): string {
    return printValue(this.value)
  }
}
