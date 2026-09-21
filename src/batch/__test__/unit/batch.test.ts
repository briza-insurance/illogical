import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { Context, Result } from '../../../common/evaluable.js'
import { BatchEngine } from '../../batch.js'
import { BatchEvaluatorOptions, BatchEvaluatorState } from '../../types.js'

describe('BatchEngine', () => {
  it('throws Error for invalid operator', () => {
    assert.throws(
      () =>
        new BatchEngine({
          expressions: {
            expr1: ['$eq', '$a', 10],
          },
        }),
      new Error('invalid expression with name expr1')
    )
  })

  describe('mergeContext', () => {
    it('properly merges context after evaluation with updated, new, and removed keys', () => {
      const evaluator = new BatchEngine({
        expressions: {
          expr1: ['==', '$a', 10],
          expr2: ['==', '$b', 'val-b'],
          expr3: ['==', '$c', true],
        },
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
        changedKeys?: string[]
      }
      context: Context
      changedKeys?: string[]
      expectedResults: Record<string, Result>
    }

    const testCases: EvaluateTestCase[] = [
      {
        name: 'evaluates all expressions in Mode 1 (no changedKeys)',
        options: {
          expressions: {
            isAdult: ['>=', '$age', 18],
            isActive: ['==', '$status', 'active'],
          },
        },
        context: { age: 20, status: 'active' },
        expectedResults: { isAdult: true, isActive: true },
      },
      {
        name: 'evaluates only affected expressions',
        options: {
          expressions: {
            isAdult: ['>=', '$age', 18],
            isActive: ['==', '$status', 'active'],
          },
        },
        initial: {
          context: { age: 20, status: 'active' },
        },
        context: { age: 15 },
        expectedResults: { isAdult: false, isActive: true },
      },
      {
        name: 'returns correctly when reference value changes',
        options: {
          expressions: {
            isAdult: ['>=', '$age', 18],
          },
        },
        initial: {
          context: { age: 20 },
        },
        context: { age: 15 },
        expectedResults: { isAdult: false },
      },
      {
        name: 'returns cached results when changed context affects no expressions',
        options: {
          expressions: {
            isAdult: ['>=', '$age', 18],
          },
        },
        initial: {
          context: { age: 20 },
        },
        context: { otherKey: 'val' },
        expectedResults: { isAdult: true },
      },
      {
        name: 'Expression with casting',
        options: {
          expressions: {
            exp1: ['==', '$Limit.(Number)', 1000],
          },
        },
        context: { Limit: '1000' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Ref in both sides of IN expression',
        options: {
          expressions: {
            exp1: ['IN', '$role', ['$status1', '$status2']],
          },
        },
        context: { role: 'status1', status1: 'status1', status2: 'status2' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Ref in both sides of IN expression - inverted',
        options: {
          expressions: {
            exp1: ['IN', ['$status1', '$status2'], '$role'],
          },
        },
        context: { role: 'status1', status1: 'status1', status2: 'status2' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Ref in array side of IN expression',
        options: {
          expressions: {
            exp1: ['IN', 'active', ['$status1', '$status2']],
          },
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Ref not in array side of IN expression',
        options: {
          expressions: {
            exp1: ['IN', ['active', 'inactive'], '$status'],
          },
        },
        context: { status: 'active' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Ref in array side of IN expression - inverted',
        options: {
          expressions: {
            exp1: ['IN', ['$status1', '$status2'], 'active'],
          },
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Ref in array side of NOT IN expression',
        options: {
          expressions: {
            exp1: ['NOT IN', 'active', ['$status1', '$status2']],
          },
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: { exp1: false },
      },
      {
        name: 'Ref in array side of NOT IN expression - inverted',
        options: {
          expressions: {
            exp1: ['NOT IN', ['$status1', '$status2'], 'active'],
          },
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: { exp1: false },
      },
      {
        name: 'OVERLAP expression',
        options: {
          expressions: {
            exp1: ['OVERLAP', ['$status1', '$status2'], ['active', 'inactive']],
          },
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: { exp1: true },
      },
      {
        name: 'OVERLAP expression - inverted',
        options: {
          expressions: {
            exp1: ['OVERLAP', ['active', 'inactive'], ['$status1', '$status2']],
          },
        },
        context: { status1: 'active', status2: 'inactive' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Multi select Ref OVERLAP expression',
        options: {
          expressions: {
            exp1: ['OVERLAP', '$statuses', ['active', 'inactive']],
          },
        },
        context: { statuses: ['active'] },
        expectedResults: { exp1: true },
      },
      {
        name: 'Multi select Ref OVERLAP expression - inverted',
        options: {
          expressions: {
            exp1: ['OVERLAP', ['active', 'inactive'], '$statuses'],
          },
        },
        context: { statuses: ['active'] },
        expectedResults: { exp1: true },
      },
      {
        name: 'UNDEFINED expression',
        options: {
          expressions: {
            exp1: ['UNDEFINED', '$status'],
          },
        },
        context: {},
        expectedResults: { exp1: true },
      },
      {
        name: 'Ref with property expression',
        options: {
          expressions: {
            exp1: ['==', '$address.state', 'NY'],
          },
        },
        context: { address: { state: 'NY' } },
        expectedResults: { exp1: true },
      },
      {
        name: 'Dynamic reference expression',
        options: {
          expressions: {
            exp1: ['==', '${key}', 'active'],
          },
        },
        context: { key: 'status', status: 'active' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Duplicate reference',
        options: {
          expressions: {
            exp1: ['==', '$status', '$status'],
          },
        },
        context: { status: 'active' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Static collections overlap',
        options: {
          expressions: {
            exp1: ['OVERLAP', ['admin', 'editor'], ['editor', 'viewer']],
          },
        },
        context: {},
        expectedResults: { exp1: true },
      },
      {
        name: 'NOR expression',
        options: {
          expressions: {
            expTrue: ['NOR', ['==', '$a', 1], ['==', '$b', 2]],
            expFalse: ['NOR', ['==', '$a', 1], ['==', '$c', 3]],
          },
        },
        context: { a: 10, b: 20, c: 3 },
        expectedResults: { expTrue: true, expFalse: false },
      },
      {
        name: 'NOT expression',
        options: {
          expressions: {
            isNotActive: ['NOT', ['==', '$status', 'active']],
          },
        },
        context: { status: 'pending' },
        expectedResults: { isNotActive: true },
      },
      {
        name: 'XOR expression',
        options: {
          expressions: {
            expTrue: ['XOR', ['==', '$a', 1], ['==', '$b', 2]],
            expFalseBothTrue: ['XOR', ['==', '$a', 1], ['==', '$c', 3]],
            expFalseBothFalse: ['XOR', ['==', '$a', 99], ['==', '$b', 99]],
          },
        },
        context: { a: 1, b: 20, c: 3 },
        expectedResults: {
          expTrue: true,
          expFalseBothTrue: false,
          expFalseBothFalse: false,
        },
      },
      {
        name: 'nested property and reference with same name',
        options: {
          expressions: {
            exp1: ['==', '$address.state', 'NY'],
            exp2: ['==', '$state', 'NJ'],
          },
        },
        context: { address: { state: 'NY' }, state: 'NJ' },
        expectedResults: { exp1: true, exp2: true },
      },
      {
        name: 'constructor reserved property does not work',
        options: {
          expressions: {
            exp1: ['==', '$constructor', 'yes'],
          },
        },
        context: { constructor: 'yes' },
        expectedResults: { exp1: false },
      },
      {
        name: 'prototype reserved property does work',
        options: {
          expressions: {
            exp1: ['==', '$prototype', 'yes'],
          },
        },
        context: { prototype: 'yes' },
        expectedResults: { exp1: true },
      },
      {
        name: 'Dynamic references',
        options: {
          expressions: {
            exp1: ['==', '$location{index}covered', 'yes'],
            exp2: ['==', '$location{index}covered', 'no'],
          },
        },
        context: { index: 1, location1covered: 'yes', location2covered: 'no' },
        expectedResults: { exp1: true, exp2: false },
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
          expressions: {
            exp1: ['==', '$RefA', 1],
            exp2: ['OVERLAP', ['$RefA', '$RefB'], [2, 3]],
            exp3: ['==', '$unrelated', 'yes'],
            exp4: ['==', '$RefB', 4],
          },
        })

        const results1 = evaluator.evaluate(contextInitial)
        assert.deepEqual(
          results1,
          { exp1: true, exp2: false, exp3: false, exp4: false },
          'Initial evaluation results should match expected'
        )

        const results2 = evaluator.evaluate(context2)
        assert.deepEqual(
          results2,
          { exp1: false, exp2: true, exp3: false, exp4: false },
          'Second evaluation results should match expected'
        )

        const results3 = evaluator.evaluate(context3)
        assert.deepEqual(
          results3,
          { exp1: false, exp2: true, exp3: false, exp4: true },
          'Third evaluation results should match expected'
        )
      })
    }

    it('runs multiple evaluations correctly', () => {
      const evaluator = new BatchEngine({
        expressions: {
          exp1: ['OVERLAP', ['$value1', '$value2'], ['123', '456']],
          exp2: ['OVERLAP', ['$value1', '$value2'], ['456', '789']],
          exp3: ['OVERLAP', ['$value1', '$value2'], ['789']],
        },
      })

      const context1 = { value1: '123' }
      const context2 = { value1: '456' }
      const context3 = { value1: '789' }

      const results1 = evaluator.evaluate(context1)
      assert.deepEqual(results1, { exp1: true, exp2: false, exp3: false })

      const results2 = evaluator.evaluate(context2)
      assert.deepEqual(results2, { exp1: true, exp2: true, exp3: false })

      const results3 = evaluator.evaluate(context3)
      assert.deepEqual(results3, { exp1: false, exp2: true, exp3: true })
    })

    it('runs multiple evaluations correctly with dynamic', () => {
      const evaluator = new BatchEngine({
        expressions: {
          exp1: ['==', '$index', '1'],
          exp2: ['==', '$index', '2'],
          exp3: ['==', '$item{index}value', 10],
        },
      })

      const context1 = { index: '1' }
      const context2 = { item1value: 10 }
      const context3 = { index: '2' }

      const results1 = evaluator.evaluate(context1)
      assert.deepEqual(
        results1,
        { exp1: true, exp2: false, exp3: false },
        'Initial context results should match expected'
      )

      const results2 = evaluator.evaluate(context2)
      assert.deepEqual(
        results2,
        { exp1: true, exp2: false, exp3: true },
        'Second context results should match expected'
      )

      const results3 = evaluator.evaluate(context3)
      assert.deepEqual(
        results3,
        { exp1: false, exp2: true, exp3: false },
        'Third context results should match expected'
      )
    })
  })

  describe('getDependencies', () => {
    it('returns a map of context keys to expression names depending on them', () => {
      const evaluator = new BatchEngine({
        expressions: {
          expA: ['AND', ['==', '$status', 'active'], ['>=', '$age', 18]],
          expB: ['==', '$status', 'pending'],
          expC: ['==', '$role', 'admin'],
          expD: ['==', '$location.state', 'NY'],
          expE: ['==', '$items[0]', 'chair'],
          expF: ['==', '$limit.(Number)', 1000],
          expG: ['==', '$item{index}value', 1000], // Dynamic and not part of graph
        },
      })

      const deps = evaluator.getDependencies()
      assert.ok(deps instanceof Map)
      assert.deepEqual(deps.get('status')?.sort(), ['expA', 'expB'])
      assert.deepEqual(deps.get('age'), ['expA'])
      assert.deepEqual(deps.get('role'), ['expC'])
      assert.deepEqual(deps.get('location'), ['expD'])
      assert.deepEqual(deps.get('items'), ['expE'])
      assert.deepEqual(deps.get('limit'), ['expF'])
    })
  })

  describe('reset', () => {
    it('clears cached results', () => {
      const evaluator = new BatchEngine({
        expressions: {
          isAdult: ['>=', '$age', 18],
        },
      })

      evaluator.evaluate({ age: 25 })
      assert.deepEqual(evaluator.getResults(), { isAdult: true })

      evaluator.reset()
      assert.deepEqual(evaluator.getResults(), {})
    })
  })

  describe('addExpression', () => {
    it('adds an expression and preserves existing cached results', () => {
      const evaluator = new BatchEngine({
        expressions: {
          isAdult: ['>=', '$age', 18],
        },
      })

      evaluator.evaluate({ age: 25, status: 'active' })
      assert.deepEqual(evaluator.getResults(), { isAdult: true })

      evaluator.addExpression('isActive', ['==', '$status', 'active'])

      // Existing cached results are preserved
      assert.deepEqual(evaluator.getResults(), { isAdult: true })

      // Forcefully evaluates newly added expression
      const results = evaluator.evaluate({ age: 25, status: 'active' })
      assert.deepEqual(results, { isAdult: true, isActive: true })
    })

    it('throws TypeError when adding a duplicate expression name', () => {
      const evaluator = new BatchEngine({
        expressions: {
          isAdult: ['>=', '$age', 18],
        },
      })

      assert.throws(
        () => evaluator.addExpression('isAdult', ['>=', '$age', 21]),
        {
          name: 'TypeError',
          message:
            "Duplicate expression name: 'isAdult'. Expression names must be unique.",
        }
      )
    })
  })

  describe('removeExpression', () => {
    it('removes an expression and purges its cached result', () => {
      const evaluator = new BatchEngine({
        expressions: {
          isAdult: ['>=', '$age', 18],
          isActive: ['==', '$status', 'active'],
        },
      })

      evaluator.evaluate({ age: 25, status: 'active' })
      assert.deepEqual(evaluator.getResults(), {
        isAdult: true,
        isActive: true,
      })

      evaluator.removeExpression('isActive')

      assert.deepEqual(evaluator.getResults(), { isAdult: true })
      assert.strictEqual(evaluator.getDependencies().has('status'), false)
    })
  })
})
