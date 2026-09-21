import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

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
          ['expr9', ['==', '$limit.(Number)', 1000]],
        ])

        const graph = buildDependencyGraph(defaultOptions, expressions)

        console.log(JSON.stringify([...graph], null, 2))

        // simple string ref: status -> expr1 (deduplicated to 1 entry)
        assert.deepEqual(graph.get('status'), [{ exprName: 'expr1' }])
        assert.deepEqual(graph.get('unmatched'), [{ exprName: 'expr1' }])

        // multi-key ref produces entries for all segment keys
        assert.deepEqual(graph.get('user.profile'), [{ exprName: 'expr2' }])

        // token-based ref extracts key token
        assert.deepEqual(graph.get('items[0]'), [{ exprName: 'expr3' }])

        // Edge case of non-array reference
        assert.deepEqual(graph.get('[0]'), [{ exprName: 'expr4' }])

        // static segment from dynamic template is tracked
        assert.deepEqual(graph.get('{region}.city'), [{ exprName: 'expr5' }])

        assert.deepEqual(graph.get('{region}'), [{ exprName: 'expr6' }])

        assert.deepEqual(graph.get('profile'), [{ exprName: 'expr8' }])
        // with data casting
        assert.deepEqual(graph.get('limit'), [{ exprName: 'expr9' }])

        // __dynamic__ entries and unmatched refs are not stored
        assert.strictEqual(graph.has('__dynamic__'), false)
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
