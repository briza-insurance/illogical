import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { Evaluable } from '../../../common/evaluable.js'
import Engine from '../../../index.js'
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
        const expressions = new Map<string, Evaluable>([
          [
            'expr1',
            engine.parse([
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ]),
          ],
          // multi-key array ref nested in expression
          ['expr2', engine.parse(['AND', ['==', '$user.profile', 'admin']])],
          // token-based ref with key and index
          ['expr3', engine.parse(['==', '$items[0]', 'val'])],
          // token-based ref with index only (no key tokens -> __dynamic__)
          ['expr4', engine.parse(['==', '$[0]', 'val'])],
          // dynamic ref template with static key segment
          ['expr5', engine.parse(['==', '${region}.city', 'NY'])],
          // dynamic ref template without static keys (all dynamic -> __dynamic__)
          ['expr6', engine.parse(['==', '${region}', 'all'])],
          // non-reference values (numbers, non-ref strings)
          ['expr7', engine.parse(['==', 42, 42])],
          ['expr8', engine.parse(['==', '$profile', 'standard'])],
          ['expr9', engine.parse(['==', '$limit.(Number)', 1000])],
        ])

        const { graph, dynamicRefs } = buildDependencyGraph(expressions)

        // simple string ref: status -> expr1 (deduplicated to 1 entry)
        assert.deepEqual(
          graph.get('status'),
          new Set(['expr1']),
          'mismatch expressions for status'
        )
        assert.deepEqual(
          graph.get('unmatched'),
          new Set(['expr1']),
          'mismatch expressions for unmatched'
        )

        // multi-key ref produces entries for all segment keys
        assert.deepEqual(
          graph.get('user'),
          new Set(['expr2']),
          'mismatch expressions for user'
        )

        // token-based ref extracts key token
        assert.deepEqual(
          graph.get('items'),
          new Set(['expr3']),
          'mismatch expressions for items'
        )

        // Edge case of non-array reference
        assert.deepEqual(
          graph.get('[0]'),
          new Set(['expr4']),
          'mismatch expressions for [0]'
        )

        assert.deepEqual(
          graph.get('profile'),
          new Set(['expr8']),
          'mismatch expressions for profile'
        )
        // with data casting
        assert.deepEqual(
          graph.get('limit'),
          new Set(['expr9']),
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
          new Set(['expr5', 'expr6']),
          'mismatch dynamic expressions'
        )
      }
    )
  })

  describe('findAffectedExpressions', () => {
    it('returns unique affected expression names and handles missing/empty keys', () => {
      const graph: DependencyGraph = new Map([
        ['status', new Set(['expr1', 'expr2'])],
        ['user', new Set(['expr2'])],
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

      assert.deepEqual([...affected].sort(), ['expr1', 'expr2'])

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
        ['items', new Set(['exprItems'])],
        ['tags', new Set(['exprTags'])],
        ['unchanged', new Set(['exprUnchanged'])],
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
      assert.deepEqual([...affected].sort(), ['exprItems', 'exprTags'])
    })

    it('correctly compares object values (order insensitive)', () => {
      const graph: DependencyGraph = new Map([
        ['config', new Set(['exprConfig'])],
        ['user', new Set(['exprUser'])],
        ['meta', new Set(['exprMeta'])],
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
      assert.deepEqual([...affected], ['exprUser'])
    })

    it("correctly compares object and early returns if they don't have the same number of keys", () => {
      const graph: DependencyGraph = new Map([
        ['config', new Set(['exprConfig'])],
        ['user', new Set(['exprUser'])],
        ['meta', new Set(['exprMeta'])],
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
      assert.deepEqual([...affected], ['exprMeta'])
    })

    it('handles type mismatches between current and new context values', () => {
      const graph: DependencyGraph = new Map([
        ['data', new Set(['exprData'])],
        ['list', new Set(['exprList'])],
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
      assert.deepEqual([...affected].sort(), ['exprData', 'exprList'])
    })
  })
})
