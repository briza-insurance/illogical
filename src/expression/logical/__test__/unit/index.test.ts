import { Value } from '../../../../operand/value'
import { Logical } from '../../'

describe('Condition Engine - Expression - Logical', () => {
  describe('evaluate', () => {

    // Test value types against value types
    test('does not allow abstract evaluate', () => {
      // @ts-ignore
      expect(() => new Logical('AND', [new Value(true), new Value(true)]).evaluate({}))
        .toThrowError('not implemented exception')
    })

  })

  test('add', () => {
    // @ts-ignore
    let exp = new Logical('AND', [])
    exp.add(new Value(1))
    exp.add(new Value(1))
    
    // @ts-ignore
    expect(new Logical('AND', [new Value(1), new Value(1)]).toString())
        .toBe('(1 AND 1)')
  })

  test('toString', () => {
      // @ts-ignore
    expect(new Logical('AND', [new Value(1), new Value(1)]).toString())
        .toBe('(1 AND 1)')
  })
})