import { Value } from '../../../../operand/value'
import { Or } from '../../or'

describe('Condition Engine - Expression - Logical - Or', () => {
  test('evaluate', () => {
    let tests = [
      // Truthy
      { operands: [new Value(true), new Value(true)], expected: true },
      { operands: [new Value(true), new Value(false)], expected: true },
      { operands: [new Value(false), new Value(true)], expected: true },
      // Falsy
      { operands: [new Value(false), new Value(false)], expected: false },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Or(test.operands).evaluate({}))
        .toBe(test.expected)
    }

    let exceptions = [
      { operands: [] },
    ]
    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => new Or(exception.operands).evaluate({}))
        .toThrowError()
    }
  })
})