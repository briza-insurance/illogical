import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { CompactRef } from '../../../bytecode/refs.js'
import { ExpressionInput } from '../../../parser/index.js'
import { defaultOptions } from '../../../parser/options.js'
import {
  buildDependencyGraph,
  findAffectedExpressions,
} from '../../dependency-graph.js'
import { DependencyGraph } from '../../types.js'

describe('Dependency graph', () => {
  describe('buildDependencyGraph', () => {
    it(
      'builds graph covering string, array, token, and dynamic ' +
        'refs while handling dynamic skips and unmatched refs',
      () => {
        const expressions = new Map<string, ExpressionInput>([
          // simple string ref + duplicate ref usage in same expression + non-matching ref
          [
            'expr1',
            [
              'AND',
              ['==', '$status', 'active'],
              ['==', '$status', 'active'],
              ['==', '$unmatched', 1],
            ],
          ],
          // multi-key array ref nested in expression
          ['expr2', ['AND', ['==', '$user.profile', 'admin']]],
          // token-based ref with key and index
          ['expr3', ['==', '$items[0]', 'val']],
          // token-based ref with index only (no key tokens -> __dynamic__)
          ['expr4', ['==', '$[0]', 'val']],
          // dynamic ref template with static key segment
          ['expr5', ['==', '${region}.city', 'NY']],
          // dynamic ref template without static keys (all dynamic -> __dynamic__)
          ['expr6', ['==', '${region}', 'all']],
          // non-reference values (numbers, non-ref strings)
          ['expr7', ['==', 42, 42]],
          ['expr8', ['==', '$profile', 'standard']],
        ])

        const sharedRefs: CompactRef[] = [
          'status',
          ['user', 'profile'],
          {
            k: 'items[0]',
            tokens: [
              { kind: 'key', value: 'items' },
              { kind: 'index', value: 0 },
            ],
          },
          {
            k: '[0]',
            tokens: [{ kind: 'index', value: 0 }],
          },
          {
            d: true,
            k: '{region}.city',
          },
          {
            d: true,
            k: '{region}',
          },
        ]

        const refKeys = [
          'status',
          'user.profile',
          'items[0]',
          '[0]',
          '{region}.city',
          '{region}',
        ]
        const graph = buildDependencyGraph(
          expressions,
          sharedRefs,
          refKeys,
          defaultOptions
        )

        // simple string ref: status -> expr1 (deduplicated to 1 entry)
        assert.deepEqual(graph.get('status'), [
          { exprName: 'expr1', refIdx: 0 },
        ])

        // multi-key ref produces entries for all segment keys
        assert.deepEqual(graph.get('user'), [{ exprName: 'expr2', refIdx: 1 }])
        // TODO: Verify in v2 what happens if a key is both a top-level key and part of a multi-key ref
        assert.deepEqual(graph.get('profile'), [
          { exprName: 'expr2', refIdx: 1 },
        ])

        // token-based ref extracts key token
        assert.deepEqual(graph.get('items'), [{ exprName: 'expr3', refIdx: 2 }])

        // static segment from dynamic template is tracked
        assert.deepEqual(graph.get('region'), undefined)

        // __dynamic__ entries and unmatched refs are not stored
        assert.strictEqual(graph.has('__dynamic__'), false)
        assert.strictEqual(graph.has('unmatched'), false)
      }
    )
  })

  describe('findAffectedExpressions', () => {
    it('returns unique affected expression names and handles missing/empty keys', () => {
      const graph: DependencyGraph = new Map([
        [
          'status',
          [
            { exprName: 'expr1', refIdx: 0 },
            { exprName: 'expr2', refIdx: 0 },
          ],
        ],
        ['user', [{ exprName: 'expr2', refIdx: 1 }]],
      ])

      // Matches across multiple keys and deduplicates expr2
      const affected = findAffectedExpressions(graph, [
        'status',
        'user',
        'unknownKey',
      ])

      assert.deepEqual([...affected].sort(), ['expr1', 'expr2'])

      // Unknown keys return empty set
      assert.strictEqual(findAffectedExpressions(graph, ['missing']).size, 0)

      // Empty changed keys return empty set
      assert.strictEqual(findAffectedExpressions(graph, []).size, 0)
    })
  })
})
