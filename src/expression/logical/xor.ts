/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import { Context, Evaluable, Result } from '../../common/evaluable'
import { isBoolean } from '../../common/type-check'
import { Logical } from '../logical'
import { Nor } from './nor'
import { Not } from './not'

// Operator key
export const OPERATOR = Symbol('XOR')

/**
 * Logical xor
 * @param {boolean} a
 * @param {boolean} b
 * @return {boolean}
 */
function xor (a: boolean, b: boolean): boolean {
  return (a || b) && !(a && b)
}

/**
 * Xor logical expression
 */
export class Xor extends Logical {
  /**
   * @constructor
   * @param {Evaluable[]} operands Collection of operands.
   */
  constructor (operands: Evaluable[]) {
    if (operands.length < 2) {
      throw new Error('logical expression must have at least two operands')
    }
    super('XOR', OPERATOR, operands)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {Result}
   */
  evaluate (ctx: Context): Result {
    let res = null
    for (const operand of this.operands) {
      if (res === null) {
        res = operand.evaluate(ctx) as boolean
      } else {
        res = xor(res, operand.evaluate(ctx) as boolean)
      }
    }
    return res
  }

  simplify (...args: [Context, string[]]): boolean | Evaluable {
    const [evaluablesLeft, trueCount] = this.operands.reduce<[Evaluable[], number]>(
      ([notSimplifiedConditions, trueCount], child) => {
        if (trueCount > 1) {
          return [notSimplifiedConditions, trueCount]
        }
        const childResult = child.simplify(...args)
        if (!isBoolean(childResult)) {
          return [[...notSimplifiedConditions, child], trueCount]
        }
        if (childResult) {
          return [notSimplifiedConditions, trueCount + 1]
        }
        return [notSimplifiedConditions, trueCount]
      }, [[], 0])
    if (trueCount > 1) {
      return false
    }
    if (evaluablesLeft.length === 0) {
      return trueCount === 1
    }
    if (evaluablesLeft.length === 1) {
      if (trueCount === 1) {
        return new Not(...evaluablesLeft)
      }
      return evaluablesLeft[0]
    }
    if (trueCount === 1) {
      return new Nor(evaluablesLeft)
    }
    return new Xor(evaluablesLeft)
  }
}
