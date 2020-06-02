/**
 * Logical expression module.
 * @module illogical/expression/logical
 */

import {
  Context,
  Result,
  Evaluable
} from '../../common/evaluable'

import { Comparison } from '../comparison'
import { Predicate } from '../predicate'

/**
 * Operand collection
 */
export type Operand = Comparison | Predicate | Logical

/**
 * Abstract logical expression
 */
export abstract class Logical implements Evaluable {
  protected operator: string
  protected operands: Operand[]

  /**
   * @constructor
   * @param {string} operator String representation of the operator.
   * @param {Operand[]} operands Collection of operands.
   */
  constructor (operator: string, operands: Operand[]) {
    this.operator = operator
    this.operands = operands
  }

  /**
   * Add new operand
   * @param {Operand} addon
   */
  add (addon: Operand): void {
    this.operands.push(addon)
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   */
  evaluate (ctx: Context): Result {
    throw new Error('not implemented exception')
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString (): string {
    return '(' + this.operands.map(
      (operand) => operand.toString()).join(` ${this.operator} `) +
    ')'
  }
}
