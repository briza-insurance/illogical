import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

import fc from 'fast-check'

import Engine from '../../index.js'
import { expressionArbitrary } from '../fuzz/expression.arbitrary.js'

describe('Fuzzing expression generator unit test', () => {
  const engineOOP = new Engine({ evaluator: 'oop' })

  it('should produce valid expressions', () => {
    fc.assert(
      fc.property(expressionArbitrary, (expression) => {
        try {
          engineOOP.parse(expression)
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err)
          assert.fail(
            `Generated invalid expression syntax:\n${JSON.stringify(
              expression
            )}.\nError: ${msg}`
          )
        }
      }),
      { numRuns: Number(process.env.FUZZ_RUNS) || 1000, maxSkipsPerRun: 1000 }
    )
  })
})
