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
        const expressions = new Map<ExpressionInput, Evaluable>([
          [
            [
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ],
            engine.parse([
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ]),
          ],
          // multi-key array ref nested in expression
          [
            ['AND', ['==', '$user.profile', 'admin']],
            engine.parse(['AND', ['==', '$user.profile', 'admin']]),
          ],
          // token-based ref with key and index
          [
            ['==', '$items[0]', 'val'],
            engine.parse(['==', '$items[0]', 'val']),
          ],
          // token-based ref with index only (no key tokens -> __dynamic__)
          [['==', '$[0]', 'val'], engine.parse(['==', '$[0]', 'val'])],
          // dynamic ref template with static key segment
          [
            ['==', '${region}.city', 'NY'],
            engine.parse(['==', '${region}.city', 'NY']),
          ],
          // dynamic ref template without static keys (all dynamic -> __dynamic__)
          [
            ['==', '${region}', 'all'],
            engine.parse(['==', '${region}', 'all']),
          ],
          // non-reference values (numbers, non-ref strings)
          [['==', 42, 42], engine.parse(['==', 42, 42])],
          [
            ['==', '$profile', 'standard'],
            engine.parse(['==', '$profile', 'standard']),
          ],
          [
            ['==', '$limit.(Number)', 1000],
            engine.parse(['==', '$limit.(Number)', 1000]),
          ],
        ])

        const { graph, dynamicRefs } = buildDependencyGraph(expressions)

        // simple string ref: status -> expr1 (deduplicated to 1 entry)
        assert.deepEqual(
          graph.get('status'),
          new Set([
            [
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ],
          ]),
          'mismatch expressions for status'
        )
        assert.deepEqual(
          graph.get('unmatched'),
          new Set([
            [
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ],
          ]),
          'mismatch expressions for unmatched'
        )

        // multi-key ref produces entries for all segment keys
        assert.deepEqual(
          graph.get('user'),
          new Set([['AND', ['==', '$user.profile', 'admin']]]),
          'mismatch expressions for user'
        )

        // token-based ref extracts key token
        assert.deepEqual(
          graph.get('items'),
          new Set([['==', '$items[0]', 'val']]),
          'mismatch expressions for items'
        )

        // Edge case of non-array reference
        assert.deepEqual(
          graph.get('[0]'),
          new Set([['==', '$[0]', 'val']]),
          'mismatch expressions for [0]'
        )

        assert.deepEqual(
          graph.get('profile'),
          new Set([['==', '$profile', 'standard']]),
          'mismatch expressions for profile'
        )
        // with data casting
        assert.deepEqual(
          graph.get('limit'),
          new Set([['==', '$limit.(Number)', 1000]]),
          'mismatch expressions for limit'
        )

        // __dynamic__ entries and unmatched refs are not stored
        assert.strictEqual(
          graph.has('__dynamic__'),
          false,
          'graph should not have __dynamic__ key'
        )

        assert.deepEqual(
          dynamicRefs,
          new Set([
            ['==', '${region}.city', 'NY'],
            ['==', '${region}', 'all'],
          ]),
          'mismatch dynamic expressions'
        )
      }
    )
  })

  describe('findAffectedExpressions', () => {
    it('returns unique affected expression names and handles missing/empty keys', () => {
      const isAdmin: ExpressionInput = ['AND', ['==', '$user.profile', 'admin']]
      const graph: DependencyGraph = new Map([
        [
          'status',
          new Set([
            [
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ],
            isAdmin,
          ]),
        ],
        ['user', new Set([isAdmin])],
      ])

      // Matches across multiple keys and deduplicates expr2
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
        ]
      )

      // Unknown keys return empty set
      assert.strictEqual(
        findAffectedExpressions(undefined, { missing: 'value' }, graph).size,
        0
      )

      // Empty changed keys return empty set
      assert.strictEqual(findAffectedExpressions(undefined, {}, graph).size, 0)
    })

    it('correctly compares array values (order sensitive)', () => {
      const graph: DependencyGraph = new Map([
        ['items', new Set([['==', '$items', [1, 2, 3]] as ExpressionInput])],
        ['tags', new Set([['==', '$tags', ['a', 'b']]])],
        ['unchanged', new Set([['==', '$unchanged', ['x', 'y']]])],
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
      assert.deepEqual(
        affected,
        new Set([
          ['==', '$items', [1, 2, 3]],
          ['==', '$tags', ['a', 'b']],
        ])
      )
    })

    it('correctly compares object values (order insensitive)', () => {
      const exprConfig: ExpressionInput = ['==', '$config', 'config1']
      const exprUser: ExpressionInput = ['==', '$user', 'user1']
      const exprMeta: ExpressionInput = ['==', '$meta', 'meta1']
      const graph: DependencyGraph = new Map([
        ['config', new Set([exprConfig])],
        ['user', new Set([exprUser])],
        ['meta', new Set([exprMeta])],
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
        ['config', new Set([exprConfig])],
        ['user', new Set([exprUser])],
        ['meta', new Set([exprMeta])],
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
        ['data', new Set([exprData])],
        ['list', new Set([exprList])],
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
