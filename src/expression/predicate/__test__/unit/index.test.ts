import { Reference } from '../../../../operand/reference'
import { Predicate } from '../../'

describe('Condition Engine - Expression - Predicate', () => {
  describe('evaluate', () => {

    // Test value types against value types
    test('does not allow abstract evaluate', () => {
      // @ts-ignore
      expect(() => new Predicate('UNDEFINED', new Reference('missing')).evaluate({}))
        .toThrowError('not implemented exception')
    })

  })

  test('toString', () => {
      // @ts-ignore
    expect(new Predicate('UNDEFINED', new Reference('missing')).toString())
        .toBe('({missing} is UNDEFINED)')
  })
})