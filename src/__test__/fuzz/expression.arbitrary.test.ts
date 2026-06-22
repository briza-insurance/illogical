import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import fc from 'fast-check'

import Engine from '../../index.js'
import { expressionArbitrary } from './expression.arbitrary.js'

describe('Fuzzing: OOP Engine Validity', () => {
  const engineOOP = new Engine({ evaluator: 'oop' })

  test('oop evaluator and simplifier execute generated expressions without syntax errors', () => {
    fc.assert(
      fc.property(expressionArbitrary, (expression) => {
        // console.log('Checking', JSON.stringify(expression))
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
