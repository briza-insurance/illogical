import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { Evaluable } from '../../../common/evaluable.js'
import { ExpressionInput } from '../../../parser/index.js'
import { evaluateBatch } from '../../evaluate.js'
import { ParsedBatch } from '../../types.js'

function createMockEvaluable(result: unknown): Evaluable {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return {
    evaluate: () => result,
    simplify: () => undefined,
    serialize: () => '',
  } as unknown as Evaluable
}

function createBatch(
  entries: [ExpressionInput, Evaluable | undefined][]
): ParsedBatch {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return {
    expressions: new Map(entries),
  } as unknown as ParsedBatch
}

describe('evaluateBatch', () => {
  const isAdult: ExpressionInput = ['>=', '$age', 18]
  const isActive: ExpressionInput = ['==', '$status', 'active']
  const isVIP: ExpressionInput = ['==', '$tier', 'vip']

  describe('full evaluation (Mode 1)', () => {
    it('evaluates all expressions when affectedExpressions is not provided', () => {
      const expressions: ExpressionInput[] = [isAdult, isActive]
      const batch = createBatch([
        [isAdult, createMockEvaluable(true)],
        [isActive, createMockEvaluable(false)],
      ])

      const results = [
        ...evaluateBatch(expressions, batch, { age: 20, status: 'inactive' }),
      ]

      assert.deepStrictEqual(results, [
        [isAdult, true],
        [isActive, false],
      ])
    })

    it('yields nothing when expressions list is empty', () => {
      const batch = createBatch([])
      const results = [...evaluateBatch([], batch, {})]

      assert.deepStrictEqual(results, [])
    })
  })

  describe('incremental evaluation (Mode 2)', () => {
    it('evaluates only affected expressions when provided', () => {
      const expressions: ExpressionInput[] = [isAdult, isActive, isVIP]
      const batch = createBatch([
        [isAdult, createMockEvaluable(false)],
        [isActive, createMockEvaluable(true)],
        [isVIP, createMockEvaluable(true)],
      ])

      const results = [
        ...evaluateBatch(expressions, batch, { age: 15 }, [isAdult]),
      ]

      assert.deepStrictEqual(results, [[isAdult, false]])
    })

    it('yields nothing when affectedExpressions is empty', () => {
      const expressions: ExpressionInput[] = [isAdult, isActive]
      const batch = createBatch([
        [isAdult, createMockEvaluable(true)],
        [isActive, createMockEvaluable(false)],
      ])

      const results = [...evaluateBatch(expressions, batch, {}, [])]

      assert.deepStrictEqual(results, [])
    })
  })

  describe('error handling', () => {
    it('throws error when target expression is not found in batch', () => {
      const expressions: ExpressionInput[] = [isAdult]
      const batch = createBatch([])

      assert.throws(
        () => [...evaluateBatch(expressions, batch, {})],
        new Error(`Expression '${JSON.stringify(isAdult)}' not found in batch`)
      )
    })

    it('throws error when affected expression is not found in batch', () => {
      const expressions: ExpressionInput[] = [isAdult]
      const batch = createBatch([[isAdult, createMockEvaluable(true)]])

      assert.throws(
        () => [...evaluateBatch(expressions, batch, {}, [isActive])],
        new Error(`Expression '${JSON.stringify(isActive)}' not found in batch`)
      )
    })

    it('throws error when expression entry in batch is undefined', () => {
      const expressions: ExpressionInput[] = [isAdult]
      const batch = createBatch([[isAdult, undefined]])

      assert.throws(
        () => [...evaluateBatch(expressions, batch, {})],
        new Error(`Expression '${JSON.stringify(isAdult)}' not found in batch`)
      )
    })

    it('throws error when evaluable returns non-boolean result', () => {
      const nonBooleanExpr: ExpressionInput = ['==', '$Limit.(Number)', 1000]
      const batch = createBatch([[nonBooleanExpr, createMockEvaluable(1000)]])

      assert.throws(
        () => [...evaluateBatch([nonBooleanExpr], batch, {})],
        new Error(
          `Unexpected result type for expression '${JSON.stringify(nonBooleanExpr)}'`
        )
      )
    })
  })
})
