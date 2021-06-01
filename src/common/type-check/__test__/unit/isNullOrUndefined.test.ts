import { isNullOrUndefined } from '../..'

describe('common - type check - isNullOrUndefined', () => {
  test.each([
    // Truthy
    [null, true],
    [undefined, true],
    // Falsy
    ['value', false],
    [1, false],
    [true, false],
    [false, false],
    [{}, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isNullOrUndefined(value)).toBe(expected)
  })
})
