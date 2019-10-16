import { Value } from '../../../../operand/value'
import { And } from '../../and'

describe('Condition Engine - Expression - Logical - And', () => {
  test('evaluate', () => {
    let tests = [
      // Truthy
      { operands: [new Value(true), new Value(true)], expected: true },
      // Falsy
      { operands: [new Value(true), new Value(false)], expected: false },
      { operands: [new Value(false), new Value(true)], expected: false },
      { operands: [new Value(false), new Value(false)], expected: false },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new And(test.operands).evaluate({}))
        .toBe(test.expected)
    }
  })
})