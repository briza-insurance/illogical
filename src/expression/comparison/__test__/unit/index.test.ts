import { Value } from '../../../../operand/value'
import { Reference } from '../../../../operand/reference'
import { Comparison } from '../../'

describe('Condition Engine - Expression - Comparison', () => {
  describe('evaluate', () => {

    // Test value types against value types
    test('does not allow abstract evaluate', () => {
      // @ts-ignore
      expect(() => new Comparison('=', new Value(1), new Value(1)).evaluate({}))
        .toThrowError('not implemented exception')
    })

  })

  test('toString', () => {
      // @ts-ignore
    expect(new Comparison('=', new Value(1), new Value(1)).toString())
        .toBe('(1 = 1)')
  })
})