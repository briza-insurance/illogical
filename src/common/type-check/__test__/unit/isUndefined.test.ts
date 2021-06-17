import { isUndefined } from '../..'

describe('common - type check - isUndefined', () => {
  test.each([
    // Truthy
    [undefined, true],
    // Falsy
    ['value', false],
    [1, false],
    [true, false],
    [false, false],
    [null, false],
    [{}, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isUndefined(value)).toBe(expected)
  })
})
