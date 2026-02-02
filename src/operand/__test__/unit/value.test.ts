import { Result } from '../../../common/evaluable.js'
import { Value } from '../../value.js'

describe('Operand - Value', () => {
  describe('constructor', () => {
    test.each([[[1, '2', true]]])('arguments %p should throw', (value) => {
      expect(() => new Value(value)).toThrowError()
    })
  })

  const testCases: [Result, Result][] = [
    [1, 1],
    ['1', '1'],
    [true, true],
    [undefined, undefined],
    [null, null],
  ]

  describe('evaluate', () => {
    test.each(testCases)('%p should evaluate as %p', (value, expected) => {
      expect(new Value(value).evaluate()).toBe(expected)
    })
  })

  describe('simplify', () => {
    test.each(testCases)('%p should simplify to %p', (value, expected) => {
      expect(new Value(value).simplify()).toBe(expected)
    })
  })

  describe('serialize', () => {
    test.each(testCases)('%p should simplify to %p', (value, expected) => {
      expect(new Value(value).serialize()).toBe(expected)
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
