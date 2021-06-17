import { isObject } from '../..'

describe('common - type check - isObject', () => {
  test.each([
    // Truthy
    [{}, true],
    // Falsy
    [true, false],
    [false, false],
    ['value', false],
    [1, false],
    [null, false],
    [undefined, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isObject(value)).toBe(expected)
  })
})
