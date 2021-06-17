import { isString } from '../..'

describe('common - type check - isString', () => {
  test.each([
    // Truthy
    ['value', true],
    ['', true],
    [String(), true],
    // Falsy
    [true, false],
    [false, false],
    [1, false],
    [null, false],
    [undefined, false],
    [{}, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isString(value)).toBe(expected)
  })
})
