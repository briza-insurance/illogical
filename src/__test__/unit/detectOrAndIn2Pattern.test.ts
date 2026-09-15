import * as assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'

import {
  CompilerState,
  detectOrAndIn2Pattern,
} from '../../bytecode/compiler.js'
import { defaultOptions } from '../../parser/options.js'

describe('detectOrAndIn2Pattern', () => {
  let state: CompilerState

  beforeEach(() => {
    state = {
      bytecode: [],
      refs: [],
      refIndex: new Map(),
      refRawKeys: [],
      refKeys: [],
      opts: defaultOptions,
      maps: {
        binary: {},
        arithmetic: {},
        presentOp: 'PRESENT',
        undefinedOp: 'UNDEFINED',
        andOp: 'AND',
        orOp: 'OR',
        norOp: 'NOR',
        notOp: 'NOT',
        xorOp: 'XOR',
        inOp: 'IN',
        notInOp: 'NOT IN',
        overlapOp: 'OVERLAP',
        eqOp: '==',
      },
      collectionCse: new Map(),
      numLocals: 0,
      consts: [],
      constIndex: new Map(),
      overlapRefsEntries: [],
      directionEntries: [],
    }
  })

  it('handles OR (AND (IN, IN)) pattern, merging setB arrays', () => {
    const input = [
      'OR',
      ['AND', ['IN', '$Ref1', ['A1', 'A2']], ['IN', '$Ref2', ['val1', 'val2']]],
      ['AND', ['IN', '$Ref1', ['A2', 'A3']], ['IN', '$Ref2', ['val2', 'val3']]],
    ]

    const result = detectOrAndIn2Pattern(input, state)

    assert.ok(result)

    assert.deepStrictEqual(result.entries, [
      ['A1', 0], // $Ref1=A1 -> $Ref2 in ['val1', 'val2']
      ['A2', 1], // $Ref1=A2 -> $Ref2 in ['val1', 'val2', 'val3']
      ['A3', 2], // $Ref1=A3 -> $Ref2 in ['val2', 'val3']
    ])

    assert.deepStrictEqual(state.consts[0], ['val1', 'val2'])
    assert.deepStrictEqual(state.consts[1], ['val1', 'val2', 'val3'])
    assert.deepStrictEqual(state.consts[2], ['val2', 'val3'])
  })

  it('handles OR (AND (EQ, EQ)) pattern, grouping target values', () => {
    const input = [
      'OR',
      ['AND', ['==', '$Ref1', 'val1'], ['==', '$Ref2', 'val2']],
      ['AND', ['==', '$Ref1', 'val1'], ['==', '$Ref2', 'val3']],
    ]

    const result = detectOrAndIn2Pattern(input, state)

    assert.ok(result)

    assert.deepStrictEqual(result.entries, [
      ['val1', 0], // $Ref1=val1 -> $Ref2 in ['val2', 'val3']
    ])

    assert.deepStrictEqual(state.consts[0], ['val2', 'val3'])
  })

  it('handles OR (AND (IN, EQ)) pattern with set on left and scalar on right', () => {
    const input = [
      'OR',
      ['AND', ['IN', '$Ref1', [1, 2]], ['==', '$Ref2', 'val1']],
      ['AND', ['IN', '$Ref1', [2, 3]], ['==', '$Ref2', 'val2']],
    ]

    const result = detectOrAndIn2Pattern(input, state)

    assert.ok(result)

    assert.deepStrictEqual(result.entries, [
      [1, 0], // $Ref1=1 -> $Ref2 in ['val1']
      [2, 1], // $Ref1=2 -> $Ref2 in ['val1', 'val2']
      [3, 2], // $Ref1=3 -> $Ref2 in ['val2']
    ])

    assert.deepStrictEqual(state.consts[0], ['val1'])
    assert.deepStrictEqual(state.consts[1], ['val1', 'val2'])
    assert.deepStrictEqual(state.consts[2], ['val2'])
  })

  it('handles OR (AND (EQ, IN)) pattern with scalar on left and set on right', () => {
    const input = [
      'OR',
      ['AND', ['==', '$Ref1', 1], ['IN', '$Ref2', ['val1', 'val2']]],
      ['AND', ['==', '$Ref1', 2], ['IN', '$Ref2', ['val2', 'val3']]],
    ]

    const result = detectOrAndIn2Pattern(input, state)

    assert.ok(result)

    assert.deepStrictEqual(result.entries, [
      [1, 0], // $Ref1=1 -> $Ref2 in ['val1', 'val2']
      [2, 1], // $Ref1=2 -> $Ref2 in ['val2', 'val3']
    ])

    assert.deepStrictEqual(state.consts[0], ['val1', 'val2'])
    assert.deepStrictEqual(state.consts[1], ['val2', 'val3'])
  })

  it('returns null if the second Refs are different between branches', () => {
    const input = [
      'OR',
      ['AND', ['==', '$Ref1', 1], ['IN', '$Ref2', ['val1', 'val2']]],
      ['AND', ['==', '$Ref1', 2], ['IN', '$RefX', ['val2', 'val3']]],
    ]

    const result = detectOrAndIn2Pattern(input, state)

    assert.strictEqual(result, null)
  })

  /**
   * Skipped as currently not working.
   */
  it.skip('returns null if there are mixed operators for the same setA value across branches', () => {
    const input = [
      'OR',
      ['AND', ['==', '$Ref1', 1], ['==', '$Ref2', 'val1']],
      ['AND', ['IN', '$Ref1', [1, 2]], ['IN', '$Ref2', ['val2', 'val3']]],
    ]

    const result = detectOrAndIn2Pattern(input, state)

    assert.strictEqual(result, null)
  })

  it('returns null if the left operand is not a reference', () => {
    const input = [
      'OR',
      ['AND', ['==', 'val1', '$Ref1'], ['==', '$Ref2', 'val2']],
      ['AND', ['==', '$Ref1', 'val1'], ['==', '$Ref2', 'val3']],
    ]

    const result = detectOrAndIn2Pattern(input, state)

    assert.strictEqual(result, null)
  })
})
