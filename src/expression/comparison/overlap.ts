import { Evaluable, Result, SimplifyArgs } from '../../common/evaluable'
import { isEvaluable } from '../../common/type-check'
import { Collection } from '../../operand/collection'
import { Comparison } from '../comparison'

// Operator key
export const OPERATOR = Symbol('OVERLAP')

const calculateSize = (value: Result | Evaluable): number =>
  isEvaluable(value)
    ? value instanceof Collection
      ? value.size()
      : 0
    : Array.isArray(value)
      ? value.length
      : 0

/**
 * Overlap comparison expression
 */
export class Overlap extends Comparison {
  /**
   * @constructor
   * @param {Evaluable} left Left operand.
   * @param {Evaluable} right Right operand.
   */
  constructor(...args: Evaluable[])
  constructor(left: Evaluable, right: Evaluable) {
    if (arguments.length !== 2) {
      throw new Error('comparison expression expects left and right operands')
    }
    super('overlap', OPERATOR, left, right)
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(...args: SimplifyArgs): Result | Evaluable {
    const leftSimplified = this.left.simplify(...args)
    const rightSimplified = this.right.simplify(...args)

    // If we don't have Results, return the original expression
    if (isEvaluable(leftSimplified) || isEvaluable(rightSimplified)) {
      return this
    }

    const result = this.comparison(leftSimplified, rightSimplified)

    // If the OVERLAP was able to evaluate to TRUE, the whole expression
    // can be simplified
    if (result === true) {
      return true
    }

    // If the OVERLAP evaluation wasn't successful, we need to check if we had
    // all values in the Context or not. If not, we need to return the
    // expression instead of a false.
    const leftSimplifiedLength = calculateSize(leftSimplified)
    const rightSimplifiedLength = calculateSize(rightSimplified)

    return this.left instanceof Collection &&
      this.right instanceof Collection &&
      this.left.size() === leftSimplifiedLength &&
      this.right.size() === rightSimplifiedLength
      ? false
      : this
  }

  /**
   * {@link Comparison.comparison}
   */
  comparison(left: Result, right: Result): boolean {
    if (
      left === undefined ||
      left === null ||
      right === undefined ||
      right === null
    ) {
      return false
    }

    if (!Array.isArray(left) || !Array.isArray(right)) {
      throw new Error('invalid OVERLAP expression, both operands must be array')
    }

    const leftArray = left as (string | number)[]
    const rightArray = right as (string | number)[]

    if (leftArray.length === 0 && rightArray.length === 0) {
      return true
    }
    return leftArray.some((element) => rightArray.includes(element))
  }

  /**
   * Get the strict representation of the expression.
   * @return {string}
   */
  toString(): string {
    const left = this.left.toString()
    const right = this.right.toString()
    return `(${left} ${this.operator} ${right})`
  }
}
