import { Value } from '../../../../operand/value'
import { Nor } from '../../nor'

describe('Condition Engine - Expression - Logical - Nor', () => {
  test('evaluate', () => {
    let tests = [
      // Truthy
      { operands: [new Value(false), new Value(false)], expected: true },
      // Falsy
      { operands: [new Value(true), new Value(false)], expected: false },
      { operands: [new Value(false), new Value(true)], expected: false },
      { operands: [new Value(true), new Value(true)], expected: false },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Nor(test.operands).evaluate({}))
        .toBe(test.expected)
    }

    let exceptions = [
      { operands: [] },
    ]
    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => new Nor(exception.operands).evaluate({}))
        .toThrowError()
    }
  })
})