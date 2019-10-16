/**
 * Test helpers module.
 * @module illogical/test
 */

/**
 * Get input permutations
 * @param inputs List of unique inputs
 * @return Collection of duplex variations
 * @example
 * ['A', 'B', 'C'] => [['A', 'B'], ['B', 'C'], ['B', 'C']]
 */
export function permutation (inputs: any[]): [any, any][] {
  const result: [any, any][] = []
  for (let i = 0, j = 0; j < inputs.length - 1;) {
    result.push([inputs[j], inputs[i + 1]])
    i++
    if (i === inputs.length - 1) {
      j++
      i = j
    }
  }
  return result
}
