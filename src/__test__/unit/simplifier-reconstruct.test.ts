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
          ['AND', ['==', '$Ref1', 'val1'], ['==', '$Ref2', 'val2']],
          ['AND', ['==', '$Ref1', 'val1'], ['==', '$Ref2', 'val3']],
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
          ['AND', ['==', '$Ref1', 'val1'], ['==', '$Ref2', 'val2']],
          ['AND', ['IN', '$Ref1', ['val1', 'home']], ['==', '$Ref2', 'val3']],
        ]

        const expected: ExpressionInput = [
          'OR',
          ['AND', ['==', '$Ref1', 'val1'], ['==', '$Ref2', 'val2']],
          ['AND', ['IN', '$Ref1', ['val1', 'home']], ['==', '$Ref2', 'val3']],
        ]

        const result = engine.simplify(input, {})

        assert.deepStrictEqual(result, expected)
      })
    })
  }
})
