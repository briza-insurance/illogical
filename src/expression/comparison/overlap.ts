/**
 * Comparison expression module.
 * @module illogical/expression/comparison
 */

import {
  Context,
  Result
} from '../../common/evaluable'

import {
  Operand
} from '../../operand'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('OVERLAP')

/**
 * Overlap comparison expression
 */
export class Overlap extends Comparison {
  /**
   * @constructor
   * @param {Operand} left Left operand.
   * @param {Operand} right Right operand.
   */
  constructor (left: Operand, right: Operand) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('overlap', left, right)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    const left = this.left.evaluate(ctx)
    const right = this.right.evaluate(ctx)
    if (left === undefined || left === null ||
      right === undefined || right === null) {
      return false
    }

    if (!Array.isArray(left) || !Array.isArray(right)) {
      throw new Error('invalid OVERLAP expression, both operands must be array')
    }

    const leftArray = left as (string|number)[]
    const rightArray = right as (string|number)[]
    return leftArray.some((element) => rightArray.includes(element))
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    const left = this.left.toString()
    const right = this.right.toString()
    return `(${left} ${this.operator} ${right})`
  }
}
