import * as assert from 'node:assert'
import { describe, it } from 'node:test'

import Engine from '../../index.js'
import { ExpressionInput } from '../../parser/index.js'

describe('detectOrAndIn2Pattern - simplify reconstruction', () => {
  for (const evaluator of ['oop', 'bytecode'] as const) {
    describe(`evaluator: ${evaluator}`, () => {
      it('should reconstruct original AST branches with EQ operator successfully', () => {
        const engine = new Engine({ evaluator })

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

      it('should reconstruct original AST branches with mixed EQ / IN operator successfully', () => {
        const engine = new Engine({ evaluator })

        const input: ExpressionInput = [
          'OR',
          [
            'AND',
            ['==', '$Loss1Type', 'property'],
            ['==', '$Loss1ClaimStatus', 'closed'],
          ],
          [
            'AND',
            ['IN', '$Loss1Type', ['property', 'home']],
            ['==', '$Loss1ClaimStatus', 'declined'],
          ],
        ]

        const expected: ExpressionInput = [
          'OR',
          [
            'AND',
            ['==', '$Loss1Type', 'property'],
            ['==', '$Loss1ClaimStatus', 'closed'],
          ],
          [
            'AND',
            ['IN', '$Loss1Type', ['property', 'home']],
            ['==', '$Loss1ClaimStatus', 'declined'],
          ],
        ]

        const result = engine.simplify(input, {})

        assert.deepStrictEqual(result, expected)
      })
    })
  }
})
