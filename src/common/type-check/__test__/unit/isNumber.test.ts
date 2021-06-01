import { isNumber } from '../..'

describe('common - type check - isNumber', () => {
  test.each([
    // Truthy
    [1, true],
    [Number(1), true],
    // Falsy
    [NaN, false],
    [Infinity, false],
    ['value', false],
    [true, false],
    [false, false],
    [null, false],
    [undefined, false],
    [{}, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isNumber(value)).toBe(expected)
  })
})
