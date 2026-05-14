import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine from '../../../index.js'
import { ExpressionInput } from '../../../parser/index.js'

describe('Bytecode Interpreter', () => {
  test('OVERLAP with null elements should work with OP_OVERLAP_SCAN_REFS_CONST', () => {
    const engine = new Engine()
    const expression: ExpressionInput = ['OVERLAP', ['$Ref1'], [null]]
    const context = { Ref1: null }

    // This should be true because [null] overlaps [null]
    assert.strictEqual(engine.evaluate(expression, context), true)
  })

  test('OVERLAP with null elements should work with OP_OVERLAP_CONST', () => {
    const engine = new Engine()
    // Using a non-pure ref collection to force OP_OVERLAP_CONST
    const expression: ExpressionInput = ['OVERLAP', ['$Ref1', 1], [null, 1]]
    const context = { Ref1: null }

    assert.strictEqual(engine.evaluate(expression, context), true)
  })

  test('OVERLAP with empty arrays should return true', () => {
    const engine = new Engine()
    assert.strictEqual(engine.evaluate(['OVERLAP', [], []], {}), true)
  })
})
