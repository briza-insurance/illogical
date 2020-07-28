import { Value } from '../../value'

describe('Operand - Value', () => {
  describe('constructor', () => {
    test.each([
      [[1, '2', true]]
    ])('arguments %p should throw', (value) => {
      expect(() => new Value(value)).toThrowError()
    })
  })

  describe('evaluate', () => {
    test.each([
      [1, 1],
      ['1', '1'],
      [true, true],
      [undefined, undefined],
      [null, null]
    ])('%p should evaluate as %p', (value, expected) => {
      expect(new Value(value).evaluate({})).toBe(expected)
    })
  })

  describe('toString', () => {
    test.each([
      [1, '1'],
      ['1', '"1"'],
      [true, 'true'],
      [undefined, 'undefined'],
      [null, 'null'],
    ])('%p should be %p', (value, expected) => {
      expect(new Value(value).toString()).toBe(expected)
    })
  })
})