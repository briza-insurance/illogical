import * as assert from 'node:assert'
import { describe, it } from 'node:test'

import Engine from '../../index.js'
import { ExpressionInput } from '../../parser/index.js'

describe('detectOrAndIn2Pattern - simplify reconstruction', () => {
  it('should reconstruct original AST branches with EQ operator successfully', () => {
    const engine = new Engine({ evaluator: 'bytecode' })

    const input: ExpressionInput = [
      'OR',
      [
        'AND',
        ['==', '$Loss1Type', 'property'],
        ['==', '$Loss1ClaimStatus', 'closed'],
      ],
      [
        'AND',
        ['==', '$Loss1Type', 'property'],
        ['==', '$Loss1ClaimStatus', 'declined'],
      ],
    ]

    // Evaluating with empty context invokes the simplify method
    // returning the original conditions when references are missing
    const result = engine.simplify(input, {})

    assert.deepStrictEqual(result, input)
  })
})
