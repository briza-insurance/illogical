import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { Evaluable } from '../../../common/evaluable.js'
import Engine, { ExpressionInput } from '../../../index.js'
import {
  buildDependencyGraph,
  findAffectedExpressions,
} from '../../dependency-graph.js'
import { DependencyGraph } from '../../types.js'

describe('Dependency graph', () => {
  const engine: Engine = new Engine({ collectEvaluableReferences: true })

  describe('buildDependencyGraph', () => {
    it(
      'builds graph covering string, array, token, and dynamic ' +
        'refs while handling dynamic skips and unmatched refs',
      () => {
        const expr1: ExpressionInput = [
          'AND',
          ['==', '$status', 'active'],
          ['==', '$status', 'active'],
          ['==', '$unmatched', 1],
        ]
        const expr2: ExpressionInput = ['AND', ['==', '$user.profile', 'admin']]
        const expr3: ExpressionInput = ['==', '$items[0]', 'val']
        const expr4: ExpressionInput = ['==', '$[0]', 'val']
        const expr5: ExpressionInput = ['==', '${region}.city', 'NY']
        const expr6: ExpressionInput = ['==', '${region}', 'all']
        const expr7: ExpressionInput = ['==', 42, 42]
        const expr8: ExpressionInput = ['==', '$profile', 'standard']
        const expr9: ExpressionInput = ['==', '$limit.(Number)', 1000]

        const expressions = [
          expr1,
          expr2,
          expr3,
          expr4,
          expr5,
          expr6,
          expr7,
          expr8,
          expr9,
        ]

        const evaluablesMap = [...expressions].reduce((map, expr) => {
          map.set(expr, engine.parse(expr))
          return map
        }, new Map<ExpressionInput, Evaluable>())

        const { graph, dynamicRefs } = buildDependencyGraph(
          expressions,
          evaluablesMap
        )

        // simple string ref: status -> expr1 (deduplicated to 1 entry)
        assert.deepEqual(
          graph.get('status'),
          [expr1],
          'mismatch expressions for status'
        )
        assert.deepEqual(
          graph.get('unmatched'),
          [expr1],
          'mismatch expressions for unmatched'
        )

        // multi-key ref produces entries for all segment keys
        assert.deepEqual(
          graph.get('user'),
          [expr2],
          'mismatch expressions for user'
        )

        // token-based ref extracts key token
        assert.deepEqual(
          graph.get('items'),
          [expr3],
          'mismatch expressions for items'
        )

        // Edge case of non-array reference
        assert.deepEqual(
          graph.get('[0]'),
          [expr4],
          'mismatch expressions for [0]'
        )

        assert.deepEqual(
          graph.get('profile'),
          [expr8],
          'mismatch expressions for profile'
        )
        // with data casting
        assert.deepEqual(
          graph.get('limit'),
          [expr9],
          'mismatch expressions for limit'
        )

        // __dynamic__ entries and unmatched refs are not stored
        assert.strictEqual(
          graph.has('{region}'),
          false,
          'graph should not have {region} key'
        )
        assert.strictEqual(
          graph.has('region'),
          false,
          'graph should not have region key'
        )

        assert.deepEqual(
          dynamicRefs,
          [expr5, expr6],
          'mismatch dynamic expressions'
        )
      }
    )
  })

  describe('findAffectedExpressions', () => {
    it('returns affected expression names and handles missing/empty keys', () => {
      const isAdmin: ExpressionInput = ['AND', ['==', '$user.profile', 'admin']]
      const graph: DependencyGraph = new Map([
        [
          'status',
          [
            [
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ],
            isAdmin,
          ],
        ],
        ['user', [isAdmin]],
      ])

      // Matches across multiple keys
      const affected = findAffectedExpressions(
        undefined,
        {
          status: 'active',
          user: 'john_doe',
          unknownKey: 'value',
        },
        graph
      )

      assert.deepEqual(
        [...affected],
        [
          [
            'AND',
            ['==', '$status', 'active'],
            ['==', '$status', 'active'],
            ['==', '$unmatched', 1],
          ],
          isAdmin,
          isAdmin,
        ]
      )

      // Unknown keys return empty set
      assert.strictEqual(
        findAffectedExpressions(undefined, { missing: 'value' }, graph).length,
        0
      )

      // Empty changed keys return empty set
      assert.strictEqual(
        findAffectedExpressions(undefined, {}, graph).length,
        0
      )
    })

    it('correctly compares array values (order sensitive)', () => {
      const graph: DependencyGraph = new Map([
        ['items', [['==', '$items', [1, 2, 3]] as ExpressionInput]],
        ['tags', [['==', '$tags', ['a', 'b']]]],
        ['unchanged', [['==', '$unchanged', ['x', 'y']]]],
      ])

      const currentContext = {
        items: [1, 2, 3],
        tags: ['a', 'b'],
        unchanged: ['x', 'y'],
      }

      const newContext = {
        items: [1, 3, 2], // same elements, different order -> affected
        tags: ['a', 'b', 'c'], // different length -> affected
        unchanged: ['x', 'y'], // identical -> not affected
      }

      const affected = findAffectedExpressions(
        currentContext,
        newContext,
        graph
      )
      assert.deepEqual(affected, [
        ['==', '$items', [1, 2, 3]],
        ['==', '$tags', ['a', 'b']],
      ])
    })

    it('correctly compares object values (order insensitive)', () => {
      const exprConfig: ExpressionInput = ['==', '$config', 'config1']
      const exprUser: ExpressionInput = ['==', '$user', 'user1']
      const exprMeta: ExpressionInput = ['==', '$meta', 'meta1']
      const graph: DependencyGraph = new Map([
        ['config', [exprConfig]],
        ['user', [exprUser]],
        ['meta', [exprMeta]],
      ])

      const currentContext = {
        config: { theme: 'dark', enabled: true },
        user: { name: 'Alice', age: 30 },
        meta: { nested: { count: 1, labels: ['a', 'b'] } },
      }

      const newContext = {
        config: { enabled: true, theme: 'dark' }, // different key order -> unchanged -> not affected
        user: { name: 'Alice', age: 31 }, // value changed -> affected
        meta: { nested: { labels: ['a', 'b'], count: 1 } }, // nested order different -> not affected
      }

      const affected = findAffectedExpressions(
        currentContext,
        newContext,
        graph
      )
      assert.deepEqual([...affected], [exprUser])
    })

    it("correctly compares object and early returns if they don't have the same number of keys", () => {
      const exprConfig: ExpressionInput = ['==', '$config', 'config1']
      const exprUser: ExpressionInput = ['==', '$user', 'user1']
      const exprMeta: ExpressionInput = ['==', '$meta', 'meta1']
      const graph: DependencyGraph = new Map([
        ['config', [exprConfig]],
        ['user', [exprUser]],
        ['meta', [exprMeta]],
      ])

      const currentContext = {
        config: { theme: 'dark', enabled: true },
        user: { name: 'Alice', age: 30 },
        meta: { nested: { count: 1, type: 'a', subtype: 'b' } },
      }

      const newContext = {
        config: { enabled: true, theme: 'dark' }, // different key order -> unchanged -> not affected
        user: { name: 'Alice', age: 30 }, // unchanged -> not affected
        meta: { nested: { count: 1, type: 'a' } }, // not same keys -> affected
      }

      const affected = findAffectedExpressions(
        currentContext,
        newContext,
        graph
      )
      assert.deepEqual([...affected], [exprMeta])
    })

    it('handles type mismatches between current and new context values', () => {
      const exprData: ExpressionInput = ['==', '$data', 'data1']
      const exprList: ExpressionInput = ['==', '$list', 'list1']
      const graph: DependencyGraph = new Map([
        ['data', [exprData]],
        ['list', [exprList]],
      ])

      const currentContext = {
        data: { a: 1 },
        list: [1, 2],
      }

      const newContext = {
        data: [1, 2], // object to array -> affected
        list: null,
      }

      const affected = findAffectedExpressions(
        currentContext,
        newContext,
        graph
      )
      assert.deepEqual([...affected].sort(), [exprData, exprList])
    })
  })
})
