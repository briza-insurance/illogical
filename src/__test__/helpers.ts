/**
 * Test helpers module.
 * @module illogical/test
 */

import { Result } from '../common/evaluable.js'

type operandValue = Result | null | undefined

/**
 * Get input permutations
 * @param inputs List of unique inputs
 * @return Collection of duplex variations
 * @example
 * ['A', 'B', 'C'] => [['A', 'B'], ['B', 'C'], ['B', 'C']]
 */
export function permutation(
  inputs: operandValue[]
): [operandValue, operandValue][] {
  const result: [operandValue, operandValue][] = []
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
