import { Value } from '../../../../operand/value'
import { Logical } from '../../'
import { And } from '../../and'

describe('Expression - Logical', () => {
  describe('evaluate', () => {

    // Test value types against value types
    test('does not allow abstract evaluate', () => {
      // @ts-ignore
      expect(() => new Logical('AND', [new Value(true), new Value(true)]).evaluate({}))
        .toThrowError('not implemented exception')
    })

  })

  test('toString', () => {
    expect(new And([new Value(1), new Value(1)]).toString()).toBe('(1 AND 1)')
  })
})
