import { Evaluable, Result } from '../../common/evaluable.js'
import { Value } from '../../operand/value.js'
import { ExpressionInput } from '../../parser/index.js'
import { Options } from '../../parser/options.js'
import { Comparison } from '../comparison/index.js'

// Operator key
export const OPERATOR = Symbol('UNDEFINED')

/**
 * Undefined comparison expression
 */
export class Undefined extends Comparison {
  /**
   * @constructor
   * @param {Evaluable} operand
   */
  constructor(...args: Evaluable[])
  constructor(operand: Evaluable) {
    if (arguments.length !== 1) {
      throw new Error(
        'comparison expression UNDEFINED expects exactly one operand'
      )
    }
    super('UNDEFINED', OPERATOR, operand, new Value(true))
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison(left: Result): boolean {
    return left === undefined
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString(): string {
    return `(${this.left.toString()} is ${this.operator})`
  }

  /**
   * {@link Evaluable.serialize}
   */
  serialize(options: Options): ExpressionInput {
    const { operatorMapping } = options
    const operator = operatorMapping.get(this.operatorSymbol)
    if (operator === undefined) {
      throw new Error(`missing operator ${this.operatorSymbol.toString()}`)
    }
    return [operator, this.left.serialize(options)]
  }
}
