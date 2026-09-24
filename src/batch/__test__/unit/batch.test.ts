import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { Context } from '../../../common/evaluable.js'
import { ExpressionInput } from '../../../parser/index.js'
import { BatchEngine } from '../../batch.js'
import { BatchEvaluatorState } from '../../types.js'

describe('BatchEngine', () => {
  const isActive: ExpressionInput = ['==', '$status', 'active']
  const isAdult: ExpressionInput = ['>=', '$age', 18]

  it('throws Error for invalid operator', () => {
    assert.throws(
      () =>
        new BatchEngine({
          expressions: [['$eq', '$a', 10]],
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
        expressions: [expr1, expr2, expr3],
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
      initial?: {
        context: Context
      }
      context: Context
      expectedResults: [ExpressionInput, boolean][]
    }

    const testCases: EvaluateTestCase[] = [
      {
        name: 'evaluates all expressions in Mode 1',
        context: { age: 20, status: 'active' },
        expectedResults: [
          [isAdult, true],
          [isActive, true],
        ],
      },
      {
        name: 'evaluates only affected expressions',
        initial: {
          context: { age: 20, status: 'active' },
        },
        context: { age: 15 },
        expectedResults: [
          [isAdult, false],
          [isActive, true],
        ],
      },
      {
        name: 'returns correctly when reference value changes',
        initial: {
          context: { age: 20 },
        },
        context: { age: 15 },
        expectedResults: [[isAdult, false]],
      },
      {
        name: 'returns cached results when changed context affects no expressions',
        initial: {
          context: { age: 20 },
        },
        context: { otherKey: 'val' },
        expectedResults: [[isAdult, true]],
      },
      {
        name: 'Expression with casting',
        context: { Limit: '1000' },
        expectedResults: [[['==', '$Limit.(Number)', 1000], true]],
      },
      {
        name: 'Ref in both sides of IN expression',
        context: { role: 'status1', status1: 'status1', status2: 'status2' },
        expectedResults: [[['IN', '$role', ['$status1', '$status2']], true]],
      },
      {
        name: 'Ref in both sides of IN expression - inverted',
        context: { role: 'status1', status1: 'status1', status2: 'status2' },
        expectedResults: [[['IN', ['$status1', '$status2'], '$role'], true]],
      },
      {
        name: 'Ref in array side of IN expression',
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: [[['IN', 'active', ['$status1', '$status2']], true]],
      },
      {
        name: 'Ref not in array side of IN expression',
        context: { status: 'active' },
        expectedResults: [[['IN', ['active', 'inactive'], '$status'], true]],
      },
      {
        name: 'Ref in array side of IN expression - inverted',
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: [[['IN', ['$status1', '$status2'], 'active'], true]],
      },
      {
        name: 'Ref in array side of NOT IN expression',
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: [
          [['NOT IN', 'active', ['$status1', '$status2']], false],
        ],
      },
      {
        name: 'Ref in array side of NOT IN expression - inverted',
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: [
          [['NOT IN', ['$status1', '$status2'], 'active'], false],
        ],
      },
      {
        name: 'OVERLAP expression',
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: [
          [['OVERLAP', ['$status1', '$status2'], ['active', 'inactive']], true],
        ],
      },
      {
        name: 'OVERLAP expression - inverted',
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: [
          [['OVERLAP', ['active', 'inactive'], ['$status1', '$status2']], true],
        ],
      },
      {
        name: 'Multi select Ref OVERLAP expression',
        context: { statuses: ['active'] },
        expectedResults: [
          [['OVERLAP', '$statuses', ['active', 'inactive']], true],
        ],
      },
      {
        name: 'Multi select Ref OVERLAP expression - inverted',
        context: { statuses: ['active'] },
        expectedResults: [
          [['OVERLAP', ['active', 'inactive'], '$statuses'], true],
        ],
      },
      {
        name: 'UNDEFINED expression',
        context: {},
        expectedResults: [[['UNDEFINED', '$status'], true]],
      },
      {
        name: 'Ref with property expression',
        context: { address: { state: 'NY' } },
        expectedResults: [[['==', '$address.state', 'NY'], true]],
      },
      {
        name: 'Dynamic reference expression',
        context: { key: 'status', status: 'active' },
        expectedResults: [[['==', '${key}', 'active'], true]],
      },
      {
        name: 'Duplicate reference',
        context: { status: 'active' },
        expectedResults: [[['==', '$status', '$status'], true]],
      },
      {
        name: 'Static collections overlap',
        context: {},
        expectedResults: [
          [['OVERLAP', ['admin', 'editor'], ['editor', 'viewer']], true],
        ],
      },
      {
        name: 'NOR expression',
        context: { a: 10, b: 20, c: 3 },
        expectedResults: [
          [['NOR', ['==', '$a', 1], ['==', '$b', 2]], true],
          [['NOR', ['==', '$a', 1], ['==', '$c', 3]], false],
        ],
      },
      {
        name: 'NOT expression',
        context: { status: 'pending' },
        expectedResults: [[['NOT', ['==', '$status', 'active']], true]],
      },
      {
        name: 'XOR expression',
        context: { a: 1, b: 20, c: 3 },
        expectedResults: [
          [['XOR', ['==', '$a', 1], ['==', '$b', 2]], true],
          [['XOR', ['==', '$a', 1], ['==', '$c', 3]], false],
          [['XOR', ['==', '$a', 99], ['==', '$b', 99]], false],
        ],
      },
      {
        name: 'nested property and reference with same name',
        context: { address: { state: 'NY' }, state: 'NJ' },
        expectedResults: [
          [['==', '$address.state', 'NY'], true],
          [['==', '$state', 'NJ'], true],
        ],
      },
      {
        name: 'constructor reserved property does not work',
        context: { constructor: 'yes' },
        expectedResults: [[['==', '$constructor', 'yes'], false]],
      },
      {
        name: 'prototype reserved property does work',
        context: { prototype: 'yes' },
        expectedResults: [[['==', '$prototype', 'yes'], true]],
      },
      {
        name: 'Dynamic references',
        context: {
          index: 1,
          location1covered: 'yes',
          location2covered: 'no',
        },
        expectedResults: [
          [['==', '$location{index}covered', 'yes'], true],
          [['==', '$location{index}covered', 'no'], false],
        ],
      },
    ]

    for (const { name, initial, context, expectedResults } of testCases) {
      it(name, () => {
        const options = {
          expressions: expectedResults.map(([expression]) => expression),
        }
        const evaluator = new BatchEngine(options)

        if (initial) {
          evaluator.evaluate(initial.context)
        }

        const results = evaluator.evaluate(context)
        for (const [expression, expectedResult] of expectedResults) {
          assert.deepEqual(results.get(expression), expectedResult)
        }
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
        const expr1: ExpressionInput = ['==', '$RefA', 1]
        const expr2: ExpressionInput = ['OVERLAP', ['$RefA', '$RefB'], [2, 3]]
        const expr3: ExpressionInput = ['==', '$unrelated', 'yes']
        const expr4: ExpressionInput = ['==', '$RefB', 4]

        const evaluator = new BatchEngine({
          expressions: [expr1, expr2, expr3, expr4],
        })

        const results1 = evaluator.evaluate(contextInitial)

        assert.deepEqual(results1.get(expr1), true)
        assert.deepEqual(results1.get(expr2), false)
        assert.deepEqual(results1.get(expr3), false)
        assert.deepEqual(results1.get(expr4), false)

        const results2 = evaluator.evaluate(context2)

        assert.deepEqual(results2.get(expr1), false)
        assert.deepEqual(results2.get(expr2), true)
        assert.deepEqual(results2.get(expr3), false)
        assert.deepEqual(results2.get(expr4), false)

        const results3 = evaluator.evaluate(context3)

        assert.deepEqual(results3.get(expr1), false)
        assert.deepEqual(results3.get(expr2), true)
        assert.deepEqual(results3.get(expr3), false)
        assert.deepEqual(results3.get(expr4), true)
      })
    }

    it('runs multiple evaluations correctly', () => {
      const expr1: ExpressionInput = [
        'OVERLAP',
        ['$value1', '$value2'],
        ['123', '456'],
      ]
      const expr2: ExpressionInput = [
        'OVERLAP',
        ['$value1', '$value2'],
        ['456', '789'],
      ]
      const expr3: ExpressionInput = [
        'OVERLAP',
        ['$value1', '$value2'],
        ['789'],
      ]

      const evaluator = new BatchEngine({
        expressions: [expr1, expr2, expr3],
      })

      const context1 = { value1: '123' }
      const context2 = { value1: '456' }
      const context3 = { value1: '789' }

      const results1 = evaluator.evaluate(context1)

      assert.deepEqual(results1.get(expr1), true)
      assert.deepEqual(results1.get(expr2), false)
      assert.deepEqual(results1.get(expr3), false)

      const results2 = evaluator.evaluate(context2)

      assert.deepEqual(results2.get(expr1), true)
      assert.deepEqual(results2.get(expr2), true)
      assert.deepEqual(results2.get(expr3), false)
      const results3 = evaluator.evaluate(context3)

      assert.deepEqual(results3.get(expr1), false)
      assert.deepEqual(results3.get(expr2), true)
      assert.deepEqual(results3.get(expr3), true)
    })

    it('runs multiple evaluations correctly with dynamic', () => {
      const expr1: ExpressionInput = ['==', '$index', '1']
      const expr2: ExpressionInput = ['==', '$index', '2']
      const expr3: ExpressionInput = ['==', '$item{index}value', 10]
      const evaluator = new BatchEngine({
        expressions: [expr1, expr2, expr3],
      })

      const context1 = { index: '1' }
      const context2 = { item1value: 10 }
      const context3 = { index: '2' }

      const results1 = evaluator.evaluate(context1)

      assert.deepEqual(results1.get(expr1), true)
      assert.deepEqual(results1.get(expr2), false)
      assert.deepEqual(results1.get(expr3), false)

      const results2 = evaluator.evaluate(context2)

      assert.deepEqual(results2.get(expr1), true)
      assert.deepEqual(results2.get(expr2), false)
      assert.deepEqual(results2.get(expr3), true)

      const results3 = evaluator.evaluate(context3)

      assert.deepEqual(results3.get(expr1), false)
      assert.deepEqual(results3.get(expr2), true)
      assert.deepEqual(results3.get(expr3), false)
    })
  })

  describe('reset', () => {
    it('clears cached results', () => {
      const evaluator = new BatchEngine({
        expressions: [isAdult],
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
        expressions: [isAdult],
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
        expressions: [isAdult, isActive],
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
        expressions: [isAdult, isActive],
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
        expressions: [isAdult, isActive],
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
