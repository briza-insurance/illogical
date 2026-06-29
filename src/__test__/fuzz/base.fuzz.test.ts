import { strict as assert } from 'node:assert'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { after, describe, test } from 'node:test'

import fc from 'fast-check'

import Engine, { Context, ExpressionInput } from '../../index.js'
import { defaultOperatorMapping } from '../../parser/options.js'
import { expressionAndContextArbitrary } from './expression.arbitrary.js'

interface FuzzingMetrics {
  totalRuns: number
  successes: number
  expectedErrors: Record<string, number>
  unexpectedErrors: number
  operatorCounts: Record<string, number>
  sampleTests: Record<
    string,
    {
      expression: ExpressionInput
      context: Context
      result?: unknown
      error?: string
    }
  >
}

describe('Fuzzing Tests', () => {
  const engineOOP = new Engine({ evaluator: 'oop' })

  const EXPECTED_ERRORS = new Set<string>([
    'operands must be numbers for Sum',
    'operands must be numbers for Multiply',
    'operands must be numbers for Divide',
    'invalid OVERLAP expression, both operands must be array',
    'operands must be numbers for Subtract',
    'invalid IN expression, both operands are array',
    'invalid NOT IN expression, both operands are array',
  ])

  const simplifyMetrics: FuzzingMetrics = {
    totalRuns: 0,
    successes: 0,
    expectedErrors: {},
    unexpectedErrors: 0,
    operatorCounts: {},
    sampleTests: {},
  }

  const evaluateMetrics: FuzzingMetrics = {
    totalRuns: 0,
    successes: 0,
    expectedErrors: {},
    unexpectedErrors: 0,
    operatorCounts: {},
    sampleTests: {},
  }

  const finalResults: {
    type: 'simplify' | 'evaluate'
    expression: ExpressionInput
    context: Context
    result?: unknown
    error?: string
  }[] = []

  const VALID_OPERATORS = new Set(defaultOperatorMapping.values())

  const extractOperators = (
    expr: ExpressionInput,
    uniqueOperators: Set<string>
  ) => {
    if (Array.isArray(expr) && typeof expr[0] === 'string') {
      if (VALID_OPERATORS.has(expr[0])) {
        uniqueOperators.add(expr[0])
      }
      for (let i = 1; i < expr.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        extractOperators(expr[i] as ExpressionInput, uniqueOperators)
      }
    }
  }

  const isExpectedError = (error: unknown): string | false => {
    if (error instanceof Error) {
      for (const expected of EXPECTED_ERRORS) {
        if (error.message.includes(expected)) {
          return expected
        }
      }
    }
    return false
  }

  test('oop evaluator simplifies successfully', () => {
    fc.assert(
      fc.property(expressionAndContextArbitrary, ({ expression, context }) => {
        simplifyMetrics.totalRuns++
        const ops = new Set<string>()
        extractOperators(expression, ops)
        ops.forEach((op) => {
          simplifyMetrics.operatorCounts[op] =
            (simplifyMetrics.operatorCounts[op] || 0) + 1
        })
        try {
          const result = engineOOP.simplify(expression, context)

          ops.forEach((op) => {
            if (!simplifyMetrics.sampleTests[op]) {
              simplifyMetrics.sampleTests[op] = { expression, context, result }
            }
          })

          // Check if result was successfully simplified.
          // If fully simplified, the result will be a boolean.
          if (typeof result === 'boolean') {
            assert.strictEqual(typeof result, 'boolean')
            simplifyMetrics.successes++

            finalResults.push({
              type: 'simplify',
              expression,
              context,
              result,
            })
          } else {
            // If partially simplified, the result must be a valid expression.
            try {
              const simplifiedResult = engineOOP.parse(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                result as ExpressionInput
              )
              assert.ok(simplifiedResult !== undefined)
              simplifyMetrics.successes++

              finalResults.push({
                type: 'simplify',
                expression,
                context,
                result,
              })
            } catch (e: unknown) {
              const matchedError = isExpectedError(e)

              const errorMsg = e instanceof Error ? e.message : String(e)
              finalResults.push({
                type: 'simplify',
                expression,
                context,
                error: errorMsg,
              })

              if (matchedError) {
                simplifyMetrics.expectedErrors[matchedError] =
                  (simplifyMetrics.expectedErrors[matchedError] || 0) + 1
              } else {
                simplifyMetrics.unexpectedErrors++
                assert.fail(
                  `Unexpected parse error: ${e instanceof Error ? e.message : String(e)}`
                )
              }
            }
          }
        } catch (e) {
          const matchedError = isExpectedError(e)
          const errorMsg = e instanceof Error ? e.message : String(e)

          finalResults.push({
            type: 'simplify',
            expression,
            context,
            error: errorMsg,
          })

          if (matchedError) {
            simplifyMetrics.expectedErrors[matchedError] =
              (simplifyMetrics.expectedErrors[matchedError] || 0) + 1
          } else {
            simplifyMetrics.unexpectedErrors++
            assert.fail(`Unexpected error: ${errorMsg}`)
          }

          ops.forEach((op) => {
            if (!simplifyMetrics.sampleTests[op]) {
              simplifyMetrics.sampleTests[op] = {
                expression,
                context,
                error: errorMsg,
              }
            }
          })
        }
      }),
      { numRuns: Number(process.env.FUZZ_RUNS) || 1000 }
    )
  })

  test('oop evaluator evaluates successfully with context', () => {
    fc.assert(
      fc.property(expressionAndContextArbitrary, ({ expression, context }) => {
        evaluateMetrics.totalRuns++
        const ops = new Set<string>()
        extractOperators(expression, ops)
        ops.forEach((op) => {
          evaluateMetrics.operatorCounts[op] =
            (evaluateMetrics.operatorCounts[op] || 0) + 1
        })
        try {
          const result = engineOOP.evaluate(expression, context)

          ops.forEach((op) => {
            if (!evaluateMetrics.sampleTests[op]) {
              evaluateMetrics.sampleTests[op] = { expression, context, result }
            }
          })

          assert.strictEqual(typeof result, 'boolean')
          evaluateMetrics.successes++

          finalResults.push({
            type: 'evaluate',
            expression,
            context,
            result,
          })
        } catch (e) {
          const matchedError = isExpectedError(e)
          const errorMsg = e instanceof Error ? e.message : String(e)

          finalResults.push({
            type: 'evaluate',
            expression,
            context,
            error: errorMsg,
          })

          if (matchedError) {
            evaluateMetrics.expectedErrors[matchedError] =
              (evaluateMetrics.expectedErrors[matchedError] || 0) + 1
          } else {
            evaluateMetrics.unexpectedErrors++
            assert.fail(`Unexpected error: ${errorMsg}`)
          }

          ops.forEach((op) => {
            if (!evaluateMetrics.sampleTests[op]) {
              evaluateMetrics.sampleTests[op] = {
                expression,
                context,
                error: errorMsg,
              }
            }
          })
        }
      }),
      { numRuns: Number(process.env.FUZZ_RUNS) || 1000 }
    )
  })

  after(() => {
    const cwd = process.cwd()
    const errorsPath = path.join(cwd, 'fuzz-results.json')

    fs.writeFileSync(errorsPath, JSON.stringify(finalResults, null, 2))

    console.log(`Simplify report:`)
    console.log(JSON.stringify(simplifyMetrics, null, 2))
    console.log(`Evaluate report:`)
    console.log(JSON.stringify(evaluateMetrics, null, 2))
  })
})
