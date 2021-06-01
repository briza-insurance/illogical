import { isNull } from '../..'

describe('common - type check - isNull', () => {
  test.each([
    // Truthy
    [null, true],
    // Falsy
    ['value', false],
    [1, false],
    [true, false],
    [false, false],
    [undefined, false],
    [{}, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isNull(value)).toBe(expected)
  })
})
