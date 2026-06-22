import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import fc from 'fast-check'

import Engine, { Input } from '../../index.js'
import {
  contextArbitrary,
  expressionArbitrary,
} from './expression.arbitrary.js'

describe('Fuzzing: Simplify', () => {
  const engineOOP = new Engine({ evaluator: 'oop' })
  const engineBytecode = new Engine({ evaluator: 'bytecode' })

  test('oop and bytecode simplifiers return the same output or error', () => {
    fc.assert(
      fc.property(
        expressionArbitrary,
        contextArbitrary,
        (expression, context) => {
          let oopResult: Input | boolean | undefined = undefined
          let bytecodeResult: Input | boolean | undefined = undefined
          let oopError, bytecodeError

          try {
            oopResult = engineOOP.simplify(expression, context)
          } catch (e: unknown) {
            oopError = e
          }

          try {
            bytecodeResult = engineBytecode.simplify(expression, context)
          } catch (e: unknown) {
            bytecodeError = e
          }

          if (oopError || bytecodeError) {
            assert.ok(
              Boolean(oopError) === Boolean(bytecodeError),
              `Error mismatch! OOP error: ${oopError?.toString()} | Bytecode error: ${bytecodeError?.toString()}`
            )
          } else if (
            typeof oopResult === 'boolean' &&
            typeof bytecodeResult === 'boolean'
          ) {
            assert.strictEqual(
              oopResult,
              bytecodeResult,
              'Result mismatch! OOP result: ' +
                JSON.stringify(oopResult) +
                ' | Bytecode result: ' +
                JSON.stringify(bytecodeResult)
            )
          } else {
            assert.deepStrictEqual(
              JSON.stringify(oopResult),
              JSON.stringify(bytecodeResult),
              'Result mismatch! OOP result: ' +
                JSON.stringify(oopResult) +
                ' | Bytecode result: ' +
                JSON.stringify(bytecodeResult)
            )
          }
        }
      ),
      { numRuns: Number(process.env.FUZZ_RUNS) || 1000 }
    )
  })
})
