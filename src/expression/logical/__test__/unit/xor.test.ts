import { Value } from '../../../../operand/value'
import { Xor } from '../../xor'

describe('Condition Engine - Expression - Logical - Xor', () => {
  test('evaluate', () => {
    let tests = [
      // Truthy
      { operands: [new Value(true), new Value(false)], expected: true },
      { operands: [new Value(false), new Value(true)], expected: true },
      // Falsy
      { operands: [new Value(false), new Value(false)], expected: false },
      { operands: [new Value(true), new Value(true)], expected: false },
      { operands: [], expected: false },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Xor(test.operands).evaluate({}))
        .toBe(test.expected)
    }
  })
})