/**
 * Operand module.
 * @module illogical/operand
 */

import { isString } from '../common/type-check'

import {
  Context,
  Result
} from '../common/evaluable'

import {
  Operand
} from '.'

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
export class Value implements Operand {
  private readonly value: Result

  /**
   * @constructor
   * @param {Result} value Constant value.
   */
  constructor (value: Result) {
    if (value === undefined || value === null) {
      throw new Error('invalid value operand')
    }
    this.value = value
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate (ctx: Context): Result {
    return this.value
  }

  /**
   * Get the strict representation of the operand.
   * @return {string}
   */
  toString (): string {
    if (Array.isArray(this.value)) {
      return '[' + (this.value as (number|string)[]).map(
        (v) => printValue(v)).join(', ') +
      ']'
    }
    return printValue(this.value)
  }
}
