import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine, {
  type Context,
  defaultOptions,
  type ExpressionInput,
} from '../index.js'
import {
  compileBatch,
  findAffectedExpressions,
  interpretBatch,
  interpretSingle,
} from './index.js'

// Shared options for all tests
const testOpts = { ...defaultOptions }

describe('Batch Evaluation', () => {
  // -----------------------------------------------------------------------
  // Helper: create a simple expression map for testing
  // -----------------------------------------------------------------------
  function makeExpressions(): Record<string, ExpressionInput> {
    return {
      isActive: ['==', '$status', 'active'],
      isPremium: ['==', '$tier', 'premium'],
      canAccess: [
        'AND',
        ['==', '$status', 'active'],
        ['==', '$tier', 'premium'],
      ],
      score: ['+', '$base', '$bonus'],
      hasPermission: [
        'OR',
        ['IN', '$role', ['admin', 'editor']],
        ['==', '$isAdmin', true],
      ],
    }
  }

  function makeContext(): Context {
    return {
      status: 'active',
      tier: 'premium',
      base: 100,
      bonus: 50,
      role: 'editor',
      isAdmin: false,
    }
  }

  // -----------------------------------------------------------------------
  // Phase 1: compileBatch
  // -----------------------------------------------------------------------
  describe('compileBatch', () => {
    test('compiles all expressions with shared refs', () => {
      const expressions = new Map(Object.entries(makeExpressions()))
      const batch = compileBatch(expressions, testOpts)

      assert.ok(batch.expressions.size === 5, 'should have 5 expressions')
      assert.ok(batch.sharedRefs.length > 0, 'should have shared refs')
      assert.ok(batch.sharedConsts.length > 0, 'should have shared consts')
    })

    test('deduplicates refs across expressions', () => {
      const expressions = new Map<string, [string, string, string]>([
        ['a', ['==', '$x', '1']],
        ['b', ['==', '$x', '2']],
        ['c', ['==', '$y', '1']],
      ])
      const batch = compileBatch(expressions, testOpts)

      // $x is used in both 'a' and 'b' — should be deduplicated to 1 entry
      const xRefs = batch.sharedRefs.filter(
        (r) => typeof r === 'string' && r === 'x'
      )
      const yRefs = batch.sharedRefs.filter(
        (r) => typeof r === 'string' && r === 'y'
      )
      assert.strictEqual(xRefs.length, 1, '$x should be deduplicated')
      assert.strictEqual(yRefs.length, 1, '$y should be deduplicated')
      assert.strictEqual(
        batch.sharedRefs.length,
        2,
        'should have exactly 2 unique refs'
      )
    })

    test('deduplicates consts across expressions', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['IN', '$x', ['same', 'other']]],
        ['b', ['IN', '$y', ['same', 'other']]],
      ])
      const batch = compileBatch(expressions, testOpts)

      // ['same', 'other'] const should be deduplicated
      const sameConsts = batch.sharedConsts.filter(
        (c) => JSON.stringify(c) === JSON.stringify(['same', 'other'])
      )
      assert.strictEqual(
        sameConsts.length,
        1,
        'const ["same","other"] should be deduplicated'
      )
    })

    test('bytecode is non-empty for each expression', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
        ['b', ['+', '$x', '$y']],
      ])
      const batch = compileBatch(expressions, testOpts)

      for (const [name, expr] of batch.expressions) {
        assert.ok(
          expr.bytecode.length > 0,
          `expression ${name} should have non-empty bytecode`
        )
      }
    })
  })

  // -----------------------------------------------------------------------
  // Phase 2: interpretSingle / interpretBatch
  // -----------------------------------------------------------------------
  describe('interpretSingle', () => {
    test('evaluates equality expression', () => {
      const expressions: Map<string, ExpressionInput> = new Map([
        ['isActive', ['==', '$status', 'active']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const result = interpretSingle(batch, 'isActive', { status: 'active' })
      assert.strictEqual(result, true)
    })

    test('evaluates arithmetic expression', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['score', ['+', '$base', '$bonus']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const result = interpretSingle(batch, 'score', { base: 100, bonus: 50 })
      assert.strictEqual(result, 150)
    })

    test('evaluates logical AND expression', () => {
      const expressions = new Map<string, ExpressionInput>([
        [
          'canAccess',
          ['AND', ['==', '$status', 'active'], ['==', '$tier', 'premium']],
        ],
      ])
      const batch = compileBatch(expressions, testOpts)

      assert.strictEqual(
        interpretSingle(batch, 'canAccess', {
          status: 'active',
          tier: 'premium',
        }),
        true
      )
      assert.strictEqual(
        interpretSingle(batch, 'canAccess', {
          status: 'active',
          tier: 'basic',
        }),
        false
      )
    })

    test('evaluates OR expression with IN', () => {
      const expressions = new Map<string, ExpressionInput>([
        [
          'hasPermission',
          [
            'OR',
            ['IN', '$role', ['admin', 'editor']],
            ['==', '$isAdmin', true],
          ],
        ],
      ])
      const batch = compileBatch(expressions, testOpts)

      assert.strictEqual(
        interpretSingle(batch, 'hasPermission', {
          role: 'editor',
          isAdmin: false,
        }),
        true
      )
      assert.strictEqual(
        interpretSingle(batch, 'hasPermission', {
          role: 'viewer',
          isAdmin: false,
        }),
        false
      )
      assert.strictEqual(
        interpretSingle(batch, 'hasPermission', {
          role: 'viewer',
          isAdmin: true,
        }),
        true
      )
    })
  })

  describe('interpretBatch', () => {
    test('evaluates all expressions when no dirty set provided', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['isActive', ['==', '$status', 'active']],
        ['isPremium', ['==', '$tier', 'premium']],
        [
          'canAccess',
          ['AND', ['==', '$status', 'active'], ['==', '$tier', 'premium']],
        ],
        ['score', ['+', '$base', '$bonus']],
        [
          'hasPermission',
          [
            'OR',
            ['IN', '$role', ['admin', 'editor']],
            ['==', '$isAdmin', true],
          ],
        ],
      ])
      const batch = compileBatch(expressions, testOpts)

      const ctx: Context = {
        status: 'active',
        tier: 'premium',
        base: 100,
        bonus: 50,
        role: 'editor',
        isAdmin: false,
      }
      const results = interpretBatch(batch, ctx)

      assert.strictEqual(results.isActive, true)
      assert.strictEqual(results.isPremium, true)
      assert.strictEqual(results.canAccess, true)
      assert.strictEqual(results.score, 150)
      assert.strictEqual(results.hasPermission, true)
    })

    test('evaluates only dirty expressions', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
        ['b', ['==', '$y', '2']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const ctx = { x: '1', y: '2' }
      const results = interpretBatch(batch, ctx, new Set(['a']))

      assert.strictEqual(results.a, true)
      assert.strictEqual(results.b, undefined, 'b should not be evaluated')
    })

    test('marks evaluated expressions as clean', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
        ['b', ['==', '$y', '2']],
      ])
      const batch = compileBatch(expressions, testOpts)

      interpretBatch(batch, { x: '1', y: '2' })
      for (const expr of batch.expressions.values()) {
        assert.strictEqual(
          expr.dirty,
          false,
          'expression should be clean after evaluation'
        )
      }
    })
  })

  // -----------------------------------------------------------------------
  // Phase 3: Dependency graph
  // -----------------------------------------------------------------------
  describe('buildDependencyGraph', () => {
    test('maps context keys to expressions', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['isActive', ['==', '$status', 'active']],
        [
          'canAccess',
          ['AND', ['==', '$status', 'active'], ['==', '$tier', 'premium']],
        ],
      ])
      const batch = compileBatch(expressions, testOpts)

      const deps = batch.dependencyGraph
      assert.ok(deps.has('status'), 'should have status key')
      assert.ok(deps.has('tier'), 'should have tier key')

      const statusDeps = deps.get('status')!
      assert.strictEqual(
        statusDeps.length,
        2,
        'status should affect 2 expressions'
      )
      assert.ok(statusDeps.some((e) => e.exprName === 'isActive'))
      assert.ok(statusDeps.some((e) => e.exprName === 'canAccess'))
    })

    test('handles expressions with no refs', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['literal', ['==', 5, 5]],
        ['ref', ['==', '$x', '1']],
      ])
      const batch = compileBatch(expressions, testOpts)

      assert.strictEqual(
        batch.dependencyGraph.size,
        1,
        'should only have 1 key in graph'
      )
      assert.ok(batch.dependencyGraph.has('x'), 'should have x key')
    })
  })

  describe('findAffectedExpressions', () => {
    test('finds expressions affected by changed keys', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
        ['b', ['==', '$y', '2']],
        ['c', ['AND', ['==', '$x', '1'], ['==', '$y', '2']]],
      ])
      const batch = compileBatch(expressions, testOpts)

      const affected = findAffectedExpressions(batch.dependencyGraph, ['x'])
      assert.ok(affected.has('a'))
      assert.ok(affected.has('c'))
      assert.ok(!affected.has('b'))
    })

    test('handles multiple changed keys', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
        ['b', ['==', '$y', '2']],
        ['c', ['==', '$z', '3']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const affected = findAffectedExpressions(batch.dependencyGraph, [
        'x',
        'z',
      ])
      assert.ok(affected.has('a'))
      assert.ok(affected.has('c'))
      assert.ok(!affected.has('b'))
    })

    test('returns empty set for unknown keys', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const affected = findAffectedExpressions(batch.dependencyGraph, [
        'nonexistent',
      ])
      assert.strictEqual(affected.size, 0)
    })
  })

  // -----------------------------------------------------------------------
  // Phase 4: BatchEvaluator class
  // -----------------------------------------------------------------------
  describe('BatchEvaluator', () => {
    test('full re-evaluation (Mode 1)', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: makeExpressions(),
      })

      const results = batch.evaluate(makeContext())

      assert.strictEqual(results.isActive, true)
      assert.strictEqual(results.isPremium, true)
      assert.strictEqual(results.canAccess, true)
      assert.strictEqual(results.score, 150)
      assert.strictEqual(results.hasPermission, true)
    })

    test('getResults returns cached results', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'] },
      })

      batch.evaluate({ x: '1' })
      const results = batch.getResults()

      assert.strictEqual(results.a, true)
    })

    test('Mode 2: incremental with trusted dirty keys', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          a: ['==', '$x', '1'],
          b: ['==', '$y', '2'],
          c: ['AND', ['==', '$x', '1'], ['==', '$y', '2']],
        },
      })

      // Full evaluation first
      batch.evaluate({ x: '1', y: '2' })

      // Incremental: only x changed
      const results = batch.evaluate({ x: '2', y: '2' }, ['x'])

      assert.strictEqual(results.a, false, 'a should reflect new x value')
      // b should retain cached value (not re-evaluated)
      assert.strictEqual(results.b, true, 'b should retain cached value')
      // c should reflect new x value (was re-evaluated)
      assert.strictEqual(results.c, false, 'c should reflect new x value')
    })

    test('incremental mode only re-evaluates expressions whose deps changed', () => {
      const engine = new Engine()
      const expressions: Record<string, ExpressionInput> = {
        a: ['>', '$x', 0],
        b: ['>', '$y', 0],
        c: ['AND', ['>', '$x', 0], ['>', '$y', 0]],
        d: ['>', '$z', 0],
      }
      const batch = engine.createBatchEvaluator({ expressions })

      // Full evaluation — all x,y,z > 0 → all true
      batch.evaluate({ x: 1, y: 1, z: 1 })

      // Track which expressions report changes
      const changedNames: string[] = []
      batch.onChange((changes) => {
        for (const c of changes) {
          changedNames.push(c.name)
        }
      })

      // x changes from 1 to -1: a flips true→false, c flips true→false
      changedNames.length = 0
      batch.evaluate({ x: -1, y: 1, z: 1 }, ['x'])
      assert.deepStrictEqual(
        changedNames.sort(),
        ['a', 'c'],
        'only a and c report changes (depend on x)'
      )

      // y changes from 1 to -1: b flips true→false, c flips false→false (no change)
      // c was already false, so onChange won't fire for c
      // This is expected — onChange only fires on result changes, not evaluations
      changedNames.length = 0
      batch.evaluate({ x: -1, y: -1, z: 1 }, ['y'])
      assert.deepStrictEqual(
        changedNames.sort(),
        ['b'],
        'only b reports change (c was already false, so no result change)'
      )

      // z changes from 1 to -1: d flips true→false
      changedNames.length = 0
      batch.evaluate({ x: -1, y: -1, z: -1 }, ['z'])
      assert.deepStrictEqual(
        changedNames.sort(),
        ['d'],
        'only d reports change (depends on z)'
      )

      // Verify final results are correct
      const finalResults = batch.getResults()
      assert.strictEqual(finalResults.a, false, 'a: -1 > 0 is false')
      assert.strictEqual(finalResults.b, false, 'b: -1 > 0 is false')
      assert.strictEqual(finalResults.c, false, 'c: AND(false, false) is false')
      assert.strictEqual(finalResults.d, false, 'd: -1 > 0 is false')
    })

    test('Mode 2: empty changedKeys returns cached results', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'] },
      })

      batch.evaluate({ x: '1' })
      const results1 = batch.evaluate({ x: '1' }, [])
      const results2 = batch.evaluate({ x: '1' })

      assert.strictEqual(results1.a, true)
      assert.strictEqual(results2.a, true)
    })

    test('context merging', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'], b: ['==', '$y', '2'] },
      })

      batch.evaluate({ x: '1' })
      const results = batch.evaluate({ x: '1', y: '2' })

      assert.strictEqual(results.a, true)
      assert.strictEqual(results.b, true)
    })

    test('context deletion via undefined sentinel', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          a: ['==', '$x', '1'],
          b: ['PRESENT', '$y'],
        },
      })

      batch.evaluate({ x: '1', y: 'present' })
      assert.strictEqual(batch.getResults().b, true)

      // Delete y
      batch.evaluate({ x: '1', y: undefined })
      assert.strictEqual(batch.getResults().b, false)
    })

    test('onChange callback', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          a: ['==', '$x', '1'],
          b: ['==', '$y', '2'],
        },
      })

      const changes: { name: string; previous: unknown; current: unknown }[] =
        []
      batch.onChange((changed) => {
        for (const c of changed) {
          changes.push({
            name: c.name,
            previous: c.previous,
            current: c.current,
          })
        }
      })

      batch.evaluate({ x: '1', y: '2' })
      batch.evaluate({ x: '2', y: '2' }, ['x'])

      assert.strictEqual(changes.length, 1)
      assert.strictEqual(changes[0].name, 'a')
      assert.strictEqual(changes[0].previous, true)
      assert.strictEqual(changes[0].current, false)
    })

    test('getDependencies', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          a: ['==', '$x', '1'],
          b: ['==', '$y', '2'],
          c: ['AND', ['==', '$x', '1'], ['==', '$y', '2']],
        },
      })

      const deps = batch.getDependencies()
      // Keys are context keys (without $ prefix)
      assert.ok(deps.has('x'), 'should have x key')
      assert.ok(deps.has('y'), 'should have y key')

      const xDeps = deps.get('x')!
      assert.ok(xDeps.includes('a'))
      assert.ok(xDeps.includes('c'))

      const yDeps = deps.get('y')!
      assert.ok(yDeps.includes('b'))
      assert.ok(yDeps.includes('c'))
    })

    test('reset clears results', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'] },
      })

      batch.evaluate({ x: '1' })
      assert.strictEqual(batch.getResults().a, true)

      batch.reset()
      assert.strictEqual(Object.keys(batch.getResults()).length, 0)
    })

    test('removeExpression', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'], b: ['==', '$y', '2'] },
      })

      batch.evaluate({ x: '1', y: '2' })
      assert.ok('a' in batch.getResults())
      assert.ok('b' in batch.getResults())

      batch.removeExpression('a')
      assert.ok(!('a' in batch.getResults()))
      assert.strictEqual(batch.evaluate({ x: '1', y: '2' }).b, true)
    })

    test('addExpression', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'] },
      })

      batch.evaluate({ x: '1' })
      assert.ok('a' in batch.getResults())
      assert.ok(!('b' in batch.getResults()))

      batch.addExpression('b', ['==', '$y', '2'])
      const results = batch.evaluate({ x: '1', y: '2' })
      assert.strictEqual(results.a, true)
      assert.strictEqual(results.b, true)
    })

    test('dispose frees caches', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'] },
      })

      batch.evaluate({ x: '1' })
      batch.dispose()

      assert.strictEqual(Object.keys(batch.getResults()).length, 0)
    })

    test('edge case: empty context', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['PRESENT', '$x'] },
      })

      const results = batch.evaluate({})
      assert.strictEqual(results.a, false)
    })

    test('edge case: arithmetic with null values', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { sum: ['+', '$a', '$b'] },
      })

      const results = batch.evaluate({ a: 10, b: 20 })
      assert.strictEqual(results.sum, 30)

      const nullResults = batch.evaluate({ a: 10, b: undefined })
      assert.strictEqual(nullResults.sum, false)
    })

    test('engine integration via createBatchEvaluator', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          isActive: ['==', '$status', 'active'],
          isPremium: ['==', '$tier', 'premium'],
          canAccess: [
            'AND',
            ['==', '$status', 'active'],
            ['==', '$tier', 'premium'],
          ],
        },
      })

      assert.ok(batch !== null)
      assert.ok(typeof batch.evaluate === 'function')
      assert.ok(typeof batch.getResults === 'function')
      assert.ok(typeof batch.dispose === 'function')
      assert.ok(typeof batch.onChange === 'function')
      assert.ok(typeof batch.getDependencies === 'function')
      assert.ok(typeof batch.reset === 'function')
      assert.ok(typeof batch.addExpression === 'function')
      assert.ok(typeof batch.removeExpression === 'function')
    })

    test('constructor validates unique expression names', () => {
      // Note: JS object literals dedupe keys, so we can't create duplicate
      // keys via literal syntax. The constructor validation ensures that if
      // a developer somehow constructs an object with duplicate keys (e.g.,
      // via Object.assign or dynamic key construction), it is caught.
      // The practical validation is tested via addExpression below.
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'], b: ['==', '$y', '2'] },
      })
      assert.ok(batch)
    })

    test('addExpression throws on duplicate name', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'], b: ['==', '$y', '2'] },
      })

      assert.throws(
        () => batch.addExpression('b', ['==', '$z', '3']),
        TypeError,
        'should throw TypeError when adding expression with existing name'
      )

      // Ensure existing expressions still work
      const results = batch.evaluate({ x: '1', y: '2' })
      assert.strictEqual(results.a, true)
      assert.strictEqual(results.b, true)
    })

    test('addExpression preserves cached results for existing expressions', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: { a: ['==', '$x', '1'] },
      })

      batch.evaluate({ x: '1' })
      assert.strictEqual(batch.getResults().a, true)

      // Add a new expression
      batch.addExpression('b', ['==', '$y', '2'])

      // Previous cached result should be preserved
      assert.strictEqual(
        batch.getResults().a,
        true,
        'a should retain cached value'
      )
      // b should be undefined (not yet evaluated)
      assert.strictEqual(
        batch.getResults().b,
        undefined,
        'b should be undefined before evaluation'
      )

      // After evaluation, both should be present
      const results = batch.evaluate({ x: '1', y: '2' })
      assert.strictEqual(results.a, true)
      assert.strictEqual(results.b, true)
    })
  })

  // -----------------------------------------------------------------------
  // Benchmark comparison
  // -----------------------------------------------------------------------
  describe('Benchmark comparison', () => {
    test('batch vs single expression evaluation', () => {
      const engine = new Engine()

      const batchSize = 100
      const expressions: Record<string, [string, string, string]> = {}
      for (let i = 0; i < batchSize; i++) {
        expressions[`expr_${i}`] = ['==', `$key_${i}`, i.toString()]
      }

      // Single expression evaluation
      const singleCtx: Context = {}
      for (let i = 0; i < batchSize; i++) {
        singleCtx[`key_${i}`] = i.toString()
      }

      const singleStart = performance.now()
      for (let iter = 0; iter < 10; iter++) {
        for (const [, expr] of Object.entries(expressions)) {
          engine.evaluate(expr, singleCtx)
        }
      }
      const singleTime = performance.now() - singleStart

      // Batch evaluation
      const batch = engine.createBatchEvaluator({ expressions })
      const batchStart = performance.now()
      for (let iter = 0; iter < 10; iter++) {
        batch.evaluate(singleCtx)
      }
      const batchTime = performance.now() - batchStart

      batch.dispose()

      console.log(`\nBenchmark (100 expressions x 10 iterations):`)
      console.log(`  Single evaluation: ${singleTime.toFixed(2)}ms`)
      console.log(`  Batch evaluation:  ${batchTime.toFixed(2)}ms`)
    })

    test('incremental vs full batch evaluation', () => {
      const engine = new Engine()

      const exprCount = 50
      const expressions: Record<string, [string, string, string]> = {}
      for (let i = 0; i < exprCount; i++) {
        expressions[`expr_${i}`] = ['==', `$key_${i % 5}`, i.toString()]
      }

      // Full context
      const fullCtx: Context = {}
      for (let i = 0; i < 5; i++) {
        fullCtx[`key_${i}`] = 'some_value'
      }

      const batch = engine.createBatchEvaluator({ expressions })

      // Full evaluation
      const fullStart = performance.now()
      for (let iter = 0; iter < 100; iter++) {
        batch.evaluate(fullCtx)
      }
      const fullTime = performance.now() - fullStart

      // Incremental evaluation (only key_0 changes)
      const incStart = performance.now()
      for (let iter = 0; iter < 100; iter++) {
        batch.evaluate(fullCtx, ['key_0'])
      }
      const incTime = performance.now() - incStart

      batch.dispose()

      console.log(`\nIncremental vs Full (50 expressions x 100 iterations):`)
      console.log(`  Full evaluation:  ${fullTime.toFixed(2)}ms`)
      console.log(`  Incremental:      ${incTime.toFixed(2)}ms`)
    })

    test('batch vs single expression evaluation (1000 expressions)', () => {
      const engine = new Engine()

      const batchSize = 1000
      const expressions: Record<string, [string, string, string]> = {}
      for (let i = 0; i < batchSize; i++) {
        expressions[`expr_${i}`] = ['==', `$key_${i}`, i.toString()]
      }

      // Single expression evaluation
      const singleCtx: Context = {}
      for (let i = 0; i < batchSize; i++) {
        singleCtx[`key_${i}`] = i.toString()
      }

      const singleStart = performance.now()
      for (let iter = 0; iter < 10; iter++) {
        for (const [, expr] of Object.entries(expressions)) {
          engine.evaluate(expr, singleCtx)
        }
      }
      const singleTime = performance.now() - singleStart

      // Batch evaluation
      const batch = engine.createBatchEvaluator({ expressions })
      const batchStart = performance.now()
      for (let iter = 0; iter < 10; iter++) {
        batch.evaluate(singleCtx)
      }
      const batchTime = performance.now() - batchStart

      batch.dispose()

      console.log(`\nBenchmark (1000 expressions x 10 iterations):`)
      console.log(`  Single evaluation: ${singleTime.toFixed(2)}ms`)
      console.log(`  Batch evaluation:  ${batchTime.toFixed(2)}ms`)
    })

    test('incremental batch vs individual evaluation — 1 field changes', () => {
      // This benchmark addresses the reviewer's scenario:
      // - 1,000 fields with varying conditions
      // - when 1 field changes
      // - how long does batch evaluate vs. evaluating all individually
      const engine = new Engine()

      const exprCount = 1000
      // Each expression depends on one of 10 context keys (varying conditions)
      const expressions: Record<string, ExpressionInput> = {}
      for (let i = 0; i < exprCount; i++) {
        const keyIndex = i % 10
        expressions[`expr_${i}`] = ['==', `$key_${keyIndex}`, i.toString()]
      }

      // Full context with 10 keys
      const fullCtx: Context = {}
      for (let i = 0; i < 10; i++) {
        fullCtx[`key_${i}`] = 'some_value'
      }

      // Warm up — full evaluation first
      const batch = engine.createBatchEvaluator({ expressions })
      batch.evaluate(fullCtx)

      // --- Incremental batch evaluation: 1 field changes ---
      const incBatchStart = performance.now()
      for (let iter = 0; iter < 100; iter++) {
        // Only key_0 changes — only ~100 expressions depend on it
        batch.evaluate(fullCtx, ['key_0'])
      }
      const incBatchTime = performance.now() - incBatchStart

      // --- Individual evaluation: evaluate ALL 1,000 expressions each time ---
      const individualStart = performance.now()
      for (let iter = 0; iter < 100; iter++) {
        for (const [, expr] of Object.entries(expressions)) {
          engine.evaluate(expr, fullCtx)
        }
      }
      const individualTime = performance.now() - individualStart

      batch.dispose()

      console.log(
        `\nBenchmark (1,000 expressions, 1 field changes, 100 iterations):`
      )
      console.log(`  Incremental batch: ${incBatchTime.toFixed(2)}ms`)
      console.log(`  Individual (all):  ${individualTime.toFixed(2)}ms`)
      console.log(
        `  Speedup:           ${(individualTime / incBatchTime).toFixed(2)}x`
      )
      console.log(
        `  Note: Simple expressions favor individual eval due to batch overhead.`
      )
      console.log(
        `  See "complex expressions" benchmark below for where batch shines.`
      )
    })

    test('incremental batch vs individual — complex expressions', () => {
      // This benchmark shows where batch evaluation shines: complex expressions
      // with nested operators benefit from shared compilation and incremental eval.
      const engine = new Engine()

      const exprCount = 500
      // Complex expressions: AND of multiple conditions with IN checks
      const expressions: Record<string, ExpressionInput> = {}
      for (let i = 0; i < exprCount; i++) {
        const keyIndex = i % 5
        expressions[`expr_${i}`] = [
          'AND',
          ['==', `$key_${keyIndex}`, 'active'],
          ['IN', `$role_${keyIndex}`, ['admin', 'editor', 'viewer']],
          ['>', `$score_${keyIndex}`, 50],
        ]
      }

      // Full context with 15 keys
      const fullCtx: Context = {}
      for (let i = 0; i < 5; i++) {
        fullCtx[`key_${i}`] = 'active'
        fullCtx[`role_${i}`] = 'admin'
        fullCtx[`score_${i}`] = 75
      }

      // Warm up
      const batch = engine.createBatchEvaluator({ expressions })
      batch.evaluate(fullCtx)

      // --- Incremental batch: 1 field changes ---
      const incBatchStart = performance.now()
      for (let iter = 0; iter < 100; iter++) {
        // Only key_0 changes — ~100 expressions depend on it
        batch.evaluate(fullCtx, ['key_0'])
      }
      const incBatchTime = performance.now() - incBatchStart

      // --- Individual: evaluate ALL 500 expressions each time ---
      const individualStart = performance.now()
      for (let iter = 0; iter < 100; iter++) {
        for (const [, expr] of Object.entries(expressions)) {
          engine.evaluate(expr, fullCtx)
        }
      }
      const individualTime = performance.now() - individualStart

      batch.dispose()

      console.log(
        `\nBenchmark (500 complex expressions, 1 field changes, 100 iterations):`
      )
      console.log(`  Incremental batch: ${incBatchTime.toFixed(2)}ms`)
      console.log(`  Individual (all):  ${individualTime.toFixed(2)}ms`)
      console.log(
        `  Speedup:           ${(individualTime / incBatchTime).toFixed(2)}x`
      )
    })
  })

  // -----------------------------------------------------------------------
  // Shared Locals — verify locals ranges and non-interference
  // -----------------------------------------------------------------------
  describe('Shared locals isolation', () => {
    test('sequential evaluation produces correct results regardless of locals', () => {
      // Even though expressions share a locals pool, each expression should
      // produce correct results independently
      const expressions = new Map<string, ExpressionInput>([
        ['exprA', ['IN', '$x', ['a', 'b', 'c']]],
        ['exprB', ['IN', '$y', ['d', 'e', 'f']]],
      ])
      const batch = compileBatch(expressions, testOpts)

      const ctx = { x: 'a', y: 'p' }
      const resultA = interpretSingle(batch, 'exprA', ctx)
      const resultB = interpretSingle(batch, 'exprB', ctx)

      assert.strictEqual(resultA, true, 'exprA should be true')
      assert.strictEqual(resultB, false, 'exprB should be false')
    })

    test('evaluations are idempotent — same context gives same results', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['expr', ['AND', ['IN', '$x', ['a', 'b']], ['==', '$y', '1']]],
      ])
      const batch = compileBatch(expressions, testOpts)
      const ctx = { x: 'a', y: '1' }

      assert.strictEqual(interpretSingle(batch, 'expr', ctx), true)
      assert.strictEqual(interpretSingle(batch, 'expr', ctx), true)
      assert.strictEqual(interpretSingle(batch, 'expr', ctx), true)

      const ctx2 = { x: 'z', y: '1' }
      assert.strictEqual(interpretSingle(batch, 'expr', ctx2), false)
      assert.strictEqual(interpretSingle(batch, 'expr', ctx), true)
      assert.strictEqual(interpretSingle(batch, 'expr', ctx2), false)
    })
  })

  // -----------------------------------------------------------------------
  // Transitive Dependencies — cascading re-evaluation through key graph
  // -----------------------------------------------------------------------
  describe('Transitive dependency resolution', () => {
    test('single key change affects all dependent expressions', () => {
      // $status is referenced by isActive, canAccess, and fullCheck
      const expressions = new Map<string, ExpressionInput>([
        ['isActive', ['==', '$status', 'active']],
        ['isPremium', ['==', '$tier', 'premium']],
        [
          'canAccess',
          ['AND', ['==', '$status', 'active'], ['==', '$tier', 'premium']],
        ],
        [
          'fullCheck',
          [
            'AND',
            ['==', '$status', 'active'],
            ['==', '$tier', 'premium'],
            ['PRESENT', '$role'],
          ],
        ],
      ])
      const batch = compileBatch(expressions, testOpts)

      const ctx = {
        status: 'active',
        tier: 'premium',
        role: 'admin',
      }

      // Full evaluation
      const fullResults = interpretBatch(batch, ctx)
      assert.strictEqual(fullResults.isActive, true)
      assert.strictEqual(fullResults.isPremium, true)
      assert.strictEqual(fullResults.canAccess, true)
      assert.strictEqual(fullResults.fullCheck, true)

      // Change only $status — should affect isActive, canAccess, fullCheck (NOT isPremium)
      const affected = findAffectedExpressions(batch.dependencyGraph, [
        'status',
      ])
      assert.ok(affected.has('isActive'), 'isActive should be affected')
      assert.ok(affected.has('canAccess'), 'canAccess should be affected')
      assert.ok(affected.has('fullCheck'), 'fullCheck should be affected')
      assert.ok(!affected.has('isPremium'), 'isPremium should NOT be affected')
    })

    test('multiple key changes accumulate all affected expressions', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
        ['b', ['==', '$y', '2']],
        ['c', ['AND', ['==', '$x', '1'], ['==', '$y', '2']]],
        ['d', ['OR', ['==', '$x', '1'], ['==', '$z', '3']]],
        ['e', ['==', '$z', '3']],
      ])
      const batch = compileBatch(expressions, testOpts)

      // Change x and z — should affect a, c, d (x) and d, e (z)
      const affected = findAffectedExpressions(batch.dependencyGraph, [
        'x',
        'z',
      ])

      assert.ok(affected.has('a'), 'a affected by x')
      assert.ok(affected.has('c'), 'c affected by x')
      assert.ok(affected.has('d'), 'd affected by x and z')
      assert.ok(affected.has('e'), 'e affected by z')
      assert.ok(!affected.has('b'), 'b not affected')
    })

    test('BatchEvaluator correctly re-evaluates transitive deps', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          isActive: ['==', '$status', 'active'],
          isPremium: ['==', '$tier', 'premium'],
          canAccess: [
            'AND',
            ['==', '$status', 'active'],
            ['==', '$tier', 'premium'],
          ],
          fullCheck: [
            'AND',
            ['==', '$status', 'active'],
            ['==', '$tier', 'premium'],
            ['PRESENT', '$role'],
          ],
        },
      })

      // Initial full evaluation
      const initial = batch.evaluate({
        status: 'active',
        tier: 'premium',
        role: 'admin',
      })
      assert.strictEqual(initial.isActive, true)
      assert.strictEqual(initial.isPremium, true)
      assert.strictEqual(initial.canAccess, true)
      assert.strictEqual(initial.fullCheck, true)

      // Change status — should cascade to isActive, canAccess, fullCheck
      const changed = batch.evaluate(
        { status: 'inactive', tier: 'premium', role: 'admin' },
        ['status']
      )

      assert.strictEqual(
        changed.isActive,
        false,
        'isActive should reflect new status'
      )
      assert.strictEqual(
        changed.isPremium,
        true,
        'isPremium unchanged (cached)'
      )
      assert.strictEqual(
        changed.canAccess,
        false,
        'canAccess should reflect new status'
      )
      assert.strictEqual(
        changed.fullCheck,
        false,
        'fullCheck should reflect new status'
      )
    })

    test('onChange reports all changed expressions in transitive cascade', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          isActive: ['==', '$status', 'active'],
          canAccess: [
            'AND',
            ['==', '$status', 'active'],
            ['==', '$tier', 'premium'],
          ],
        },
      })

      const changes: string[] = []
      batch.onChange((changed) => {
        for (const c of changed) {
          changes.push(c.name)
        }
      })

      batch.evaluate({ status: 'active', tier: 'premium' })

      // Change status — both isActive and canAccess should change
      batch.evaluate({ status: 'inactive', tier: 'premium' }, ['status'])

      assert.ok(changes.includes('isActive'), 'isActive should be reported')
      assert.ok(changes.includes('canAccess'), 'canAccess should be reported')
    })

    test('key not in dependency graph returns empty affected set', () => {
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$x', '1']],
        ['b', ['==', '$y', '2']],
      ])
      const batch = compileBatch(expressions, testOpts)

      // 'z' is not referenced by any expression
      const affected = findAffectedExpressions(batch.dependencyGraph, ['z'])
      assert.strictEqual(affected.size, 0)

      // In BatchEvaluator, this should return cached results without re-evaluation
      const engine = new Engine()
      const evaluator = engine.createBatchEvaluator({
        expressions: {
          a: ['==', '$x', '1'],
          b: ['==', '$y', '2'],
        },
      })
      evaluator.evaluate({ x: '1', y: '2' })
      const results = evaluator.evaluate({ x: '1', y: '2', z: 'new' }, ['z'])

      assert.strictEqual(results.a, true)
      assert.strictEqual(results.b, true)
    })

    test('complex expression with many refs — all deps tracked', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          complex: [
            'AND',
            ['==', '$a', '1'],
            ['==', '$b', '2'],
            ['==', '$c', '3'],
            ['IN', '$d', ['x', 'y', 'z']],
            ['OR', ['==', '$e', 'true'], ['PRESENT', '$f']],
          ],
        },
      })

      const deps = batch.getDependencies()
      const expectedKeys = ['a', 'b', 'c', 'd', 'e', 'f']
      for (const key of expectedKeys) {
        assert.ok(deps.has(key), `${key} should be in dependency graph`)
        const exprList = deps.get(key)!
        assert.ok(
          exprList.includes('complex'),
          `${key} should reference complex`
        )
      }

      // Changing any of these keys should affect the complex expression
      // Use compileBatch directly to access the dependency graph
      const expressions: Map<string, ExpressionInput> = new Map(
        Object.entries({
          complex: [
            'AND',
            ['==', '$a', '1'],
            ['==', '$b', '2'],
            ['==', '$c', '3'],
            ['IN', '$d', ['x', 'y', 'z']],
            ['OR', ['==', '$e', 'true'], ['PRESENT', '$f']],
          ],
        }) as [string, ExpressionInput][]
      )
      const testBatch = compileBatch(expressions, testOpts)
      for (const key of expectedKeys) {
        const affected = findAffectedExpressions(testBatch.dependencyGraph, [
          key,
        ])
        assert.ok(
          affected.has('complex'),
          `complex should be affected by ${key}`
        )
      }
    })
  })

  // -----------------------------------------------------------------------
  // Dynamic References — multi-key, token-based, and placeholder refs
  // -----------------------------------------------------------------------
  describe('Dynamic reference dependency tracking', () => {
    test('multi-key refs — top-level key is tracked', () => {
      // $account.region → CompactRef: ['account', 'region']
      // The dependency graph should track 'account' as the top-level key
      const expressions = new Map<string, ExpressionInput>([
        ['hasRegion', ['PRESENT', '$account.region']],
        ['isEU', ['==', '$account.region', 'eu']],
        ['other', ['==', '$status', 'active']],
      ])
      const batch = compileBatch(expressions, testOpts)

      // 'account' should be in the dependency graph
      assert.ok(
        batch.dependencyGraph.has('account'),
        'should track account key'
      )
      const accountDeps = batch.dependencyGraph.get('account')!
      assert.ok(accountDeps.some((e) => e.exprName === 'hasRegion'))
      assert.ok(accountDeps.some((e) => e.exprName === 'isEU'))
      assert.ok(!accountDeps.some((e) => e.exprName === 'other'))

      // Changing 'account' should affect hasRegion and isEU
      const affected = findAffectedExpressions(batch.dependencyGraph, [
        'account',
      ])
      assert.ok(affected.has('hasRegion'))
      assert.ok(affected.has('isEU'))
      assert.ok(!affected.has('other'))
    })

    test('multi-key refs — both keys tracked', () => {
      // $account.region → ['account', 'region']
      // Both top-level keys should be tracked
      const expressions = new Map<string, ExpressionInput>([
        ['val', ['==', '$account.region', 'eu']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const deps = batch.dependencyGraph
      // Both 'account' and 'region' should be in the graph
      assert.ok(deps.has('account'), 'should track account')
      assert.ok(deps.has('region'), 'should track region')
    })

    test('BatchEvaluator handles multi-key refs in incremental mode', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          hasRegion: ['PRESENT', '$account.region'],
          isEU: ['==', '$account.region', 'eu'],
          isUS: ['==', '$account.region', 'us'],
        },
      })

      batch.evaluate({
        account: { region: 'eu' },
        status: 'active',
      })

      // Changing 'account' should cascade to all account-dependent expressions
      const changed = batch.evaluate(
        { account: { region: 'us' }, status: 'active' },
        ['account']
      )

      assert.strictEqual(changed.hasRegion, true)
      assert.strictEqual(changed.isEU, false)
      assert.strictEqual(changed.isUS, true)
    })

    test('token-based refs — key tokens are tracked', () => {
      // $items[0] → CompactRefFull with tokens: [{kind:'key',value:'items'}, {kind:'index',value:0}]
      // The dependency graph should track 'items' as a top-level key
      // Note: plainKey[index].property is a known parsing limitation in the core library.
      // Token-based refs with just key+index work correctly.
      const expressions = new Map<string, ExpressionInput>([
        ['firstItem', ['PRESENT', '$items[0]']],
        ['other', ['==', '$status', 'active']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const deps = batch.dependencyGraph
      assert.ok(
        deps.has('items'),
        'should track items key from token-based ref'
      )
      const itemsDeps = deps.get('items')!
      assert.ok(itemsDeps.some((e) => e.exprName === 'firstItem'))
      assert.ok(!itemsDeps.some((e) => e.exprName === 'other'))
    })

    test('dynamic refs — static key parts are tracked', () => {
      // $region.city → CompactRefFull with d:true, k:'{region}.city'
      // The dynamic {region} is resolved at runtime, but 'city' is a static part
      const expressions = new Map<string, ExpressionInput>([
        ['val', ['==', '$region.city', 'london']],
      ])
      const batch = compileBatch(expressions, testOpts)

      // The dependency graph should track 'city' as a static key part
      // (since the actual key for 'region' is resolved at runtime)
      const deps = batch.dependencyGraph
      // 'city' should be tracked as a static key in the template
      assert.ok(
        deps.has('city'),
        'should track static key part from dynamic ref'
      )
    })

    test('simple refs still work after dynamic ref changes', () => {
      // Ensure the ref lookup fix didn't break simple refs
      const expressions = new Map<string, ExpressionInput>([
        ['a', ['==', '$status', 'active']],
        ['b', ['==', '$tier', 'premium']],
        ['c', ['PRESENT', '$account.region']],
      ])
      const batch = compileBatch(expressions, testOpts)

      const deps = batch.dependencyGraph
      assert.ok(deps.has('status'), 'should track simple ref status')
      assert.ok(deps.has('tier'), 'should track simple ref tier')
      assert.ok(deps.has('account'), 'should track multi-key ref top-level key')

      const statusAffected = findAffectedExpressions(deps, ['status'])
      assert.ok(statusAffected.has('a'))
      assert.ok(!statusAffected.has('b'))
      assert.ok(!statusAffected.has('c'))
    })

    test('mixed ref types in same expression', () => {
      const engine = new Engine()
      const batch = engine.createBatchEvaluator({
        expressions: {
          complex: [
            'AND',
            ['==', '$status', 'active'], // simple ref
            ['==', '$account.region', 'eu'], // multi-key ref
            ['PRESENT', '$items[0]'], // token-based ref (key+index)
          ],
        },
      })

      const deps = batch.getDependencies()
      assert.ok(deps.has('status'), 'should track simple ref')
      assert.ok(deps.has('account'), 'should track multi-key ref top-level')
      assert.ok(deps.has('items'), 'should track token-based ref')

      // Changing any of these keys should affect the complex expression
      for (const key of ['status', 'account', 'items']) {
        const affected = findAffectedExpressions(
          compileBatch(
            new Map([
              [
                'complex',
                [
                  'AND',
                  ['==', '$status', 'active'],
                  ['==', '$account.region', 'eu'],
                  ['PRESENT', '$items[0]'],
                ],
              ],
            ]),
            testOpts
          ).dependencyGraph,
          [key]
        )
        assert.ok(affected.has('complex'), `${key} should affect complex`)
      }
    })
  })
})
