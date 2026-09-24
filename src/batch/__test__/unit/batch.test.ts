import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { Context } from '../../../common/evaluable.js'
import { ExpressionInput } from '../../../parser/index.js'
import { BatchEngine } from '../../batch.js'
import { BatchEvaluatorOptions, BatchEvaluatorState } from '../../types.js'

describe('BatchEngine', () => {
  const isActive: ExpressionInput = ['==', '$status', 'active']
  const isAdult: ExpressionInput = ['>=', '$age', 18]

  it('throws Error for invalid operator', () => {
    assert.throws(
      () =>
        new BatchEngine({
          expressions: new Set([['$eq', '$a', 10]]),
        }),
      new Error('invalid expression: ["$eq","$a",10]')
    )
  })

  describe('mergeContext', () => {
    it('properly merges context after evaluation with updated, new, and removed keys', () => {
      const expr1: ExpressionInput = ['==', '$a', 10]
      const expr2: ExpressionInput = ['==', '$b', 'val-b']
      const expr3: ExpressionInput = ['==', '$c', true]

      const evaluator = new BatchEngine({
        expressions: new Set([expr1, expr2, expr3]),
      })

      // Initial evaluation with a few keys
      evaluator.evaluate({
        a: 1,
        b: 'val-b',
        toRemove: 'temporary',
      })

      // Second evaluation: updated 'a', retained 'b', new 'c', and removed 'toRemove'
      evaluator.evaluate({
        a: 10,
        c: true,
        toRemove: undefined,
      })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const state = (evaluator as unknown as { state: BatchEvaluatorState })
        .state

      assert.deepEqual(
        { ...state.lastContext },
        {
          a: 10,
          b: 'val-b',
          c: true,
        }
      )
      assert.strictEqual('toRemove' in (state.lastContext ?? {}), false)
    })
  })

  describe('evaluate', () => {
    interface EvaluateTestCase {
      name: string
      options: BatchEvaluatorOptions
      initial?: {
        context: Context
      }
      context: Context
      expectedResults: Map<ExpressionInput, boolean>
    }

    const testCases: EvaluateTestCase[] = [
      {
        name: 'evaluates all expressions in Mode 1',
        options: {
          expressions: new Set([isAdult, isActive]),
        },
        context: { age: 20, status: 'active' },
        expectedResults: new Map([
          [isAdult, true],
          [isActive, true],
        ]),
      },
      {
        name: 'evaluates only affected expressions',
        options: {
          expressions: new Set([isAdult, isActive]),
        },
        initial: {
          context: { age: 20, status: 'active' },
        },
        context: { age: 15 },
        expectedResults: new Map([
          [isAdult, false],
          [isActive, true],
        ]),
      },
      {
        name: 'returns correctly when reference value changes',
        options: {
          expressions: new Set([isAdult]),
        },
        initial: {
          context: { age: 20 },
        },
        context: { age: 15 },
        expectedResults: new Map([[isAdult, false]]),
      },
      {
        name: 'returns cached results when changed context affects no expressions',
        options: {
          expressions: new Set([isAdult]),
        },
        initial: {
          context: { age: 20 },
        },
        context: { otherKey: 'val' },
        expectedResults: new Map([[isAdult, true]]),
      },
      {
        name: 'Expression with casting',
        options: {
          expressions: new Set([['==', '$Limit.(Number)', 1000]]),
        },
        context: { Limit: '1000' },
        expectedResults: new Map([[['==', '$Limit.(Number)', 1000], true]]),
      },
      {
        name: 'Ref in both sides of IN expression',
        options: {
          expressions: new Set([['IN', '$role', ['$status1', '$status2']]]),
        },
        context: { role: 'status1', status1: 'status1', status2: 'status2' },
        expectedResults: new Map([
          [['IN', '$role', ['$status1', '$status2']], true],
        ]),
      },
      {
        name: 'Ref in both sides of IN expression - inverted',
        options: {
          expressions: new Set([['IN', ['$status1', '$status2'], '$role']]),
        },
        context: { role: 'status1', status1: 'status1', status2: 'status2' },
        expectedResults: new Map([
          [['IN', ['$status1', '$status2'], '$role'], true],
        ]),
      },
      {
        name: 'Ref in array side of IN expression',
        options: {
          expressions: new Set([['IN', 'active', ['$status1', '$status2']]]),
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: new Map([
          [['IN', 'active', ['$status1', '$status2']], true],
        ]),
      },
      {
        name: 'Ref not in array side of IN expression',
        options: {
          expressions: new Set([['IN', ['active', 'inactive'], '$status']]),
        },
        context: { status: 'active' },
        expectedResults: new Map([
          [['IN', ['active', 'inactive'], '$status'], true],
        ]),
      },
      {
        name: 'Ref in array side of IN expression - inverted',
        options: {
          expressions: new Set([['IN', ['$status1', '$status2'], 'active']]),
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: new Map([
          [['IN', ['$status1', '$status2'], 'active'], true],
        ]),
      },
      {
        name: 'Ref in array side of NOT IN expression',
        options: {
          expressions: new Set([
            ['NOT IN', 'active', ['$status1', '$status2']],
          ]),
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: new Map([
          [['NOT IN', 'active', ['$status1', '$status2']], false],
        ]),
      },
      {
        name: 'Ref in array side of NOT IN expression - inverted',
        options: {
          expressions: new Set([
            ['NOT IN', ['$status1', '$status2'], 'active'],
          ]),
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: new Map([
          [['NOT IN', ['$status1', '$status2'], 'active'], false],
        ]),
      },
      {
        name: 'OVERLAP expression',
        options: {
          expressions: new Set([
            ['OVERLAP', ['$status1', '$status2'], ['active', 'inactive']],
          ]),
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: new Map([
          [['OVERLAP', ['$status1', '$status2'], ['active', 'inactive']], true],
        ]),
      },
      {
        name: 'OVERLAP expression - inverted',
        options: {
          expressions: new Set([
            ['OVERLAP', ['active', 'inactive'], ['$status1', '$status2']],
          ]),
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: new Map([
          [['OVERLAP', ['active', 'inactive'], ['$status1', '$status2']], true],
        ]),
      },
      {
        name: 'Multi select Ref OVERLAP expression',
        options: {
          expressions: new Set([
            ['OVERLAP', '$statuses', ['active', 'inactive']],
          ]),
        },
        context: { statuses: ['active'] },
        expectedResults: new Map([
          [['OVERLAP', '$statuses', ['active', 'inactive']], true],
        ]),
      },
      {
        name: 'Multi select Ref OVERLAP expression - inverted',
        options: {
          expressions: new Set([
            ['OVERLAP', ['active', 'inactive'], '$statuses'],
          ]),
        },
        context: { statuses: ['active'] },
        expectedResults: new Map([
          [['OVERLAP', ['active', 'inactive'], '$statuses'], true],
        ]),
      },
      {
        name: 'UNDEFINED expression',
        options: {
          expressions: new Set([['UNDEFINED', '$status']]),
        },
        context: {},
        expectedResults: new Map([[['UNDEFINED', '$status'], true]]),
      },
      {
        name: 'Ref with property expression',
        options: {
          expressions: new Set([['==', '$address.state', 'NY']]),
        },
        context: { address: { state: 'NY' } },
        expectedResults: new Map([[['==', '$address.state', 'NY'], true]]),
      },
      {
        name: 'Dynamic reference expression',
        options: {
          expressions: new Set([['==', '${key}', 'active']]),
        },
        context: { key: 'status', status: 'active' },
        expectedResults: new Map([[['==', '${key}', 'active'], true]]),
      },
      {
        name: 'Duplicate reference',
        options: {
          expressions: new Set([['==', '$status', '$status']]),
        },
        context: { status: 'active' },
        expectedResults: new Map([[['==', '$status', '$status'], true]]),
      },
      {
        name: 'Static collections overlap',
        options: {
          expressions: new Set([
            ['OVERLAP', ['admin', 'editor'], ['editor', 'viewer']],
          ]),
        },
        context: {},
        expectedResults: new Map([
          [['OVERLAP', ['admin', 'editor'], ['editor', 'viewer']], true],
        ]),
      },
      {
        name: 'NOR expression',
        options: {
          expressions: new Set([
            ['NOR', ['==', '$a', 1], ['==', '$b', 2]],
            ['NOR', ['==', '$a', 1], ['==', '$c', 3]],
          ]),
        },
        context: { a: 10, b: 20, c: 3 },
        expectedResults: new Map([
          [['NOR', ['==', '$a', 1], ['==', '$b', 2]], true],
          [['NOR', ['==', '$a', 1], ['==', '$c', 3]], false],
        ]),
      },
      {
        name: 'NOT expression',
        options: {
          expressions: new Set([['NOT', ['==', '$status', 'active']]]),
        },
        context: { status: 'pending' },
        expectedResults: new Map([
          [['NOT', ['==', '$status', 'active']], true],
        ]),
      },
      {
        name: 'XOR expression',
        options: {
          expressions: new Set([
            ['XOR', ['==', '$a', 1], ['==', '$b', 2]],
            ['XOR', ['==', '$a', 1], ['==', '$c', 3]],
            ['XOR', ['==', '$a', 99], ['==', '$b', 99]],
          ]),
        },
        context: { a: 1, b: 20, c: 3 },
        expectedResults: new Map([
          [['XOR', ['==', '$a', 1], ['==', '$b', 2]], true],
          [['XOR', ['==', '$a', 1], ['==', '$c', 3]], false],
          [['XOR', ['==', '$a', 99], ['==', '$b', 99]], false],
        ]),
      },
      {
        name: 'nested property and reference with same name',
        options: {
          expressions: new Set([
            ['==', '$address.state', 'NY'],
            ['==', '$state', 'NJ'],
          ]),
        },
        context: { address: { state: 'NY' }, state: 'NJ' },
        expectedResults: new Map([
          [['==', '$address.state', 'NY'], true],
          [['==', '$state', 'NJ'], true],
        ]),
      },
      {
        name: 'constructor reserved property does not work',
        options: {
          expressions: new Set([['==', '$constructor', 'yes']]),
        },
        context: { constructor: 'yes' },
        expectedResults: new Map([[['==', '$constructor', 'yes'], false]]),
      },
      {
        name: 'prototype reserved property does work',
        options: {
          expressions: new Set([['==', '$prototype', 'yes']]),
        },
        context: { prototype: 'yes' },
        expectedResults: new Map([[['==', '$prototype', 'yes'], true]]),
      },
      {
        name: 'Dynamic references',
        options: {
          expressions: new Set([
            ['==', '$location{index}covered', 'yes'],
            ['==', '$location{index}covered', 'no'],
          ]),
        },
        context: {
          index: 1,
          location1covered: 'yes',
          location2covered: 'no',
        },
        expectedResults: new Map([
          [['==', '$location{index}covered', 'yes'], true],
          [['==', '$location{index}covered', 'no'], false],
        ]),
      },
    ]

    for (const {
      name,
      options,
      initial,
      context,
      expectedResults,
    } of testCases) {
      it(name, () => {
        const evaluator = new BatchEngine(options)

        if (initial) {
          evaluator.evaluate(initial.context)
        }

        const results = evaluator.evaluate(context)
        assert.deepEqual(results, expectedResults)
        assert.deepEqual(evaluator.getResults(), expectedResults)
      })
    }
  })

  describe('evaluate - multiple runs', () => {
    const contexts = [
      {
        description:
          'runs multiple evaluations correctly providing only updated context',
        contextInitial: { RefA: 1, RefB: 1 },
        context2: { RefA: 2 },
        context3: { RefB: 4 },
      },
      {
        description:
          'runs multiple evaluations correctly providing full context',
        contextInitial: { RefA: 1, RefB: 1 },
        context2: { RefA: 2, RefB: 1 },
        context3: { RefA: 2, RefB: 4 },
      },
    ]
    for (const {
      description,
      contextInitial,
      context2,
      context3,
    } of contexts) {
      it(description, () => {
        const evaluator = new BatchEngine({
          expressions: new Set([
            ['==', '$RefA', 1],
            ['OVERLAP', ['$RefA', '$RefB'], [2, 3]],
            ['==', '$unrelated', 'yes'],
            ['==', '$RefB', 4],
          ]),
        })

        const results1 = evaluator.evaluate(contextInitial)
        assert.deepEqual(
          results1,
          new Map([
            [['==', '$RefA', 1], true],
            [['OVERLAP', ['$RefA', '$RefB'], [2, 3]], false],
            [['==', '$unrelated', 'yes'], false],
            [['==', '$RefB', 4], false],
          ]),
          'Initial evaluation results should match expected'
        )

        const results2 = evaluator.evaluate(context2)
        assert.deepEqual(
          results2,
          new Map([
            [['==', '$RefA', 1], false],
            [['OVERLAP', ['$RefA', '$RefB'], [2, 3]], true],
            [['==', '$unrelated', 'yes'], false],
            [['==', '$RefB', 4], false],
          ]),
          'Second evaluation results should match expected'
        )

        const results3 = evaluator.evaluate(context3)
        assert.deepEqual(
          results3,
          new Map([
            [['==', '$RefA', 1], false],
            [['OVERLAP', ['$RefA', '$RefB'], [2, 3]], true],
            [['==', '$unrelated', 'yes'], false],
            [['==', '$RefB', 4], true],
          ]),
          'Third evaluation results should match expected'
        )
      })
    }

    it('runs multiple evaluations correctly', () => {
      const evaluator = new BatchEngine({
        expressions: new Set([
          ['OVERLAP', ['$value1', '$value2'], ['123', '456']],
          ['OVERLAP', ['$value1', '$value2'], ['456', '789']],
          ['OVERLAP', ['$value1', '$value2'], ['789']],
        ]),
      })

      const context1 = { value1: '123' }
      const context2 = { value1: '456' }
      const context3 = { value1: '789' }

      const results1 = evaluator.evaluate(context1)
      assert.deepEqual(
        results1,
        new Map([
          [['OVERLAP', ['$value1', '$value2'], ['123', '456']], true],
          [['OVERLAP', ['$value1', '$value2'], ['456', '789']], false],
          [['OVERLAP', ['$value1', '$value2'], ['789']], false],
        ])
      )

      const results2 = evaluator.evaluate(context2)
      assert.deepEqual(
        results2,
        new Map([
          [['OVERLAP', ['$value1', '$value2'], ['123', '456']], true],
          [['OVERLAP', ['$value1', '$value2'], ['456', '789']], true],
          [['OVERLAP', ['$value1', '$value2'], ['789']], false],
        ])
      )

      const results3 = evaluator.evaluate(context3)
      assert.deepEqual(
        results3,
        new Map([
          [['OVERLAP', ['$value1', '$value2'], ['123', '456']], false],
          [['OVERLAP', ['$value1', '$value2'], ['456', '789']], true],
          [['OVERLAP', ['$value1', '$value2'], ['789']], true],
        ])
      )
    })

    it('runs multiple evaluations correctly with dynamic', () => {
      const evaluator = new BatchEngine({
        expressions: new Set([
          ['==', '$index', '1'],
          ['==', '$index', '2'],
          ['==', '$item{index}value', 10],
        ]),
      })

      const context1 = { index: '1' }
      const context2 = { item1value: 10 }
      const context3 = { index: '2' }

      const results1 = evaluator.evaluate(context1)
      assert.deepEqual(
        results1,
        new Map([
          [['==', '$index', '1'], true],
          [['==', '$index', '2'], false],
          [['==', '$item{index}value', 10], false],
        ]),
        'Initial context results should match expected'
      )

      const results2 = evaluator.evaluate(context2)
      assert.deepEqual(
        results2,
        new Map([
          [['==', '$index', '1'], true],
          [['==', '$index', '2'], false],
          [['==', '$item{index}value', 10], true],
        ]),
        'Second context results should match expected'
      )

      const results3 = evaluator.evaluate(context3)
      assert.deepEqual(
        results3,
        new Map([
          [['==', '$index', '1'], false],
          [['==', '$index', '2'], true],
          [['==', '$item{index}value', 10], false],
        ]),
        'Third context results should match expected'
      )
    })
  })

  describe('reset', () => {
    it('clears cached results', () => {
      const evaluator = new BatchEngine({
        expressions: new Set([isAdult]),
      })

      evaluator.evaluate({ age: 25 })
      assert.deepEqual(evaluator.getResultForExpression(isAdult), true)

      evaluator.reset()
      assert.deepEqual(evaluator.getResultForExpression(isAdult), undefined)
    })
  })

  describe('addExpression', () => {
    it('adds an expression and preserves existing cached results', () => {
      const evaluator = new BatchEngine({
        expressions: new Set([isAdult]),
      })

      evaluator.evaluate({ age: 25, status: 'active' })
      assert.deepEqual(evaluator.getResultForExpression(isAdult), true)

      evaluator.addExpression(isActive)

      // Existing cached results are preserved
      assert.deepEqual(evaluator.getResultForExpression(isAdult), true)
      assert.deepEqual(evaluator.getResultForExpression(isActive), undefined)

      // Forcefully evaluates newly added expression
      evaluator.evaluate({ age: 25, status: 'active' })
      assert.deepEqual(evaluator.getResultForExpression(isAdult), true)
      assert.deepEqual(evaluator.getResultForExpression(isActive), true)
    })
  })

  describe('removeExpression', () => {
    it('removes an expression and purges its cached result', () => {
      const evaluator = new BatchEngine({
        expressions: new Set([isAdult, isActive]),
      })

      evaluator.evaluate({ age: 25, status: 'active' })
      assert.deepEqual(evaluator.getResultForExpression(isAdult), true)
      assert.deepEqual(evaluator.getResultForExpression(isActive), true)

      evaluator.removeExpression(isActive)

      assert.deepEqual(evaluator.getResultForExpression(isAdult), true)
      assert.deepEqual(evaluator.getResultForExpression(isActive), undefined)
    })
  })

  describe('dispose', () => {
    it('clears all expressions and cached results', () => {
      const evaluator = new BatchEngine({
        expressions: new Set([isAdult, isActive]),
      })

      evaluator.evaluate({ age: 25, status: 'active' })
      const results = evaluator.getResults()
      assert.deepStrictEqual(results.get(isAdult), true)
      assert.deepStrictEqual(results.get(isActive), true)

      evaluator.dispose()

      const newResults = evaluator.getResults()

      // New returned WeakMap is clean
      assert.deepStrictEqual(newResults.get(isAdult), undefined)
      assert.deepStrictEqual(newResults.get(isActive), undefined)

      // But the previous reference still holds the old cached results until
      // GC collects the expression references.
      assert.deepStrictEqual(results.get(isAdult), true)
      assert.deepStrictEqual(results.get(isActive), true)
    })
  })

  describe('getResultForExpression', () => {
    it('retrieves the cached result for a specific expression', () => {
      const evaluator = new BatchEngine({
        expressions: new Set([isAdult, isActive]),
      })

      evaluator.evaluate({ age: 25, status: 'inactive' })

      assert.strictEqual(evaluator.getResultForExpression(isAdult), true)
      assert.strictEqual(evaluator.getResultForExpression(isActive), false)
      assert.strictEqual(
        evaluator.getResultForExpression(['nonExistent']),
        undefined
      )
    })
  })
})
