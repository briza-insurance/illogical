import { isNumber, isString, isObject } from '../../type-check'

describe('Condition Engine - Common - Type Check', () => {
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
      [() => {}, false]
  ])('isNumber(%p) should be %p.', (value, expected) => {
    // @ts-ignore
    expect(isNumber(value)).toBe(expected)
  })

  test.each([
    ['1', true],
    [new String('1'), true],
    [1, false],
    [true, false],
    [false, false],
    [{}, false],
    [() => {}, false]
  ])('isString(%p) should be %p.', (value, expected) => {
    // @ts-ignore
    expect(isString(value)).toBe(expected)
  })

  test.each([
    [{}, true],
    ['hi', false],
    [1, false],
    [null, false],
    [undefined, false]
  ])('isObject(%p) should be %p.', (value, expected) => {
    expect(isObject(value)).toBe(expected)
  })
})
