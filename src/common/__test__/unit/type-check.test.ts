import { isNumber, isObject, isString } from '../../type-check'

describe('Common - Type Check', () => {
  describe('isNumber', () => {
    test.each([
      // Truthy
      [1, true],
      [1.0, true],
      // Falsy
      [Infinity, false],
      [-Infinity, false],
      ['1', false],
      [true, false],
      [false, false],
      [{}, false],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [() => {}, false],
    ])('%p should evaluate as %p', (value, expected) => {
      // @ts-ignore
      expect(isNumber(value)).toBe(expected)
    })
  })

  describe('isString', () => {
    test.each([
      // Truthy
      ['1', true],
      [new String('1'), true],
      // Falsy
      [1, false],
      [true, false],
      [false, false],
      [{}, false],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [() => {}, false],
    ])('%p should evaluate as %p', (value, expected) => {
      // @ts-ignore
      expect(isString(value)).toBe(expected)
    })
  })

  describe('isObject', () => {
    test.each([
      // Truthy
      [{}, true],
      // Falsy
      ['hi', false],
      [1, false],
      [null, false],
      [undefined, false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isObject(value)).toBe(expected)
    })
  })
})
