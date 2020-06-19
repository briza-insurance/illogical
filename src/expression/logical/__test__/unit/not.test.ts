import { Value } from '../../../../operand/value'
import { Not } from '../../not'

describe('Condition Engine - Expression - Logical - Not', () => {
  test('evaluate', () => {
    let tests = [
      // Truthy
      { operand: new Value(false), expected: true },
      // Falsy
      { operand: new Value(true), expected: false }
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Not(test.operand).evaluate({}))
        .toBe(test.expected)
    }

    let exceptions = [
      { operands: [] },
      { operands: [new Value(true), new Value(false)] },
    ]
    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => new Not(...exception.operands).evaluate({}))
        .toThrowError()
    }
  })
})