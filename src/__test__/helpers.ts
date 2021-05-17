/**
 * Test helpers module.
 * @module illogical/test
 */

import { EvaluableType, Result } from '../common/evaluable'
import { Operand } from '../operand'
import { Input } from '../parser'

/**
 * Get input permutations
 * @param inputs List of unique inputs
 * @return Collection of duplex variations
 * @example
 * ['A', 'B', 'C'] => [['A', 'B'], ['B', 'C'], ['B', 'C']]
 */
export function permutation(inputs: unknown[]): [unknown, unknown][] {
  const result: [unknown, unknown][] = []
  for (let i = 0, j = 0; j < inputs.length - 1; ) {
    result.push([inputs[j], inputs[i + 1]])
    i++
    if (i === inputs.length - 1) {
      j++
      i = j
    }
  }
  return result
}

/**
 * Create a primitive operand, evaluating as the passed value.
 * @param value
 */
export const operand = (value: Result): Operand =>
  new (class extends Operand {
    type: EvaluableType = EvaluableType.Operand
    constructor(private readonly value: Result) {
      super()
    }
    evaluate() {
      return this.value
    }
    simplify() {
      return this.value
    }
    serialize(): Input {
      throw new Error('not implemented')
    }
  })(value)

/**
 * Create a primitive operand that cannot be simplified.
 * @param value
 */
export const notSimplified = (): Operand =>
  new (class extends Operand {
    type: EvaluableType = EvaluableType.Operand
    constructor() {
      super()
    }
    evaluate() {
      return undefined
    }
    simplify() {
      return this
    }
    serialize(): Input {
      throw new Error('not implemented')
    }
  })()
