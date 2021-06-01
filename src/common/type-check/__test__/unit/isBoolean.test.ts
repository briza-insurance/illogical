import { isBoolean } from '../..'

describe('common - type check - isBoolean', () => {
  test.each([
    // Truthy
    [true, true],
    [false, true],
    [Boolean(true), true],
    // Falsy
    ['value', false],
    [1, false],
    [null, false],
    [undefined, false],
    [{}, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isBoolean(value)).toBe(expected)
  })
})
