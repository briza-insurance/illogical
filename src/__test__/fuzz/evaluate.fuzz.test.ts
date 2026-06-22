import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import fc from 'fast-check'

import Engine from '../../index.js'
import {
  contextArbitrary,
  expressionArbitrary,
} from './expression.arbitrary.js'

describe('Fuzzing: Evaluate', () => {
  const engineOOP = new Engine({ evaluator: 'oop' })
  const engineBytecode = new Engine({ evaluator: 'bytecode' })

  test('oop and bytecode evaluators return the same output or error', () => {
    fc.assert(
      fc.property(
        expressionArbitrary,
        contextArbitrary,
        (expression, context) => {
          let oopResult: boolean | undefined = undefined
          let bytecodeResult: boolean | undefined = undefined
          let oopError, bytecodeError

          try {
            oopResult = engineOOP.evaluate(expression, context)
          } catch (e: unknown) {
            oopError = e
          }

          try {
            bytecodeResult = engineBytecode.evaluate(expression, context)
          } catch (e: unknown) {
            bytecodeError = e
          }

          if (oopError || bytecodeError) {
            // Both must error, and we assert nothing about the exact message
            // or maybe the message should be somewhat similar, but often it's sufficient that both error
            assert.ok(
              Boolean(oopError) === Boolean(bytecodeError),
              `Error mismatch! OOP error: ${oopError?.toString()} | Bytecode error: ${bytecodeError?.toString()}`
            )
          } else if (
            typeof oopResult === 'boolean' &&
            typeof bytecodeResult === 'boolean'
          ) {
            // Both ran successfully, results must match
            assert.deepStrictEqual(
              oopResult,
              bytecodeResult,
              `Result mismatch! OOP result: ${oopResult} | Bytecode result: ${bytecodeResult}`
            )
          } else {
            assert.fail(
              `Unexpected result types! OOP result: ${JSON.stringify(oopResult)}` +
                ` | Bytecode result: ${JSON.stringify(bytecodeResult)}`
            )
          }
        }
      ),
      { numRuns: Number(process.env.FUZZ_RUNS) || 1000 }
    )
  })
})
