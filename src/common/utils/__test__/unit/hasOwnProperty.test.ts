import { hasOwnProperty } from '../..'

describe('common - fp - hasOwnProperty', () => {
  it.each([
    [{ toString: null }, true],
    [{ toString: undefined }, true],
    [{}, false],
  ])('%p should be resolved as %p', (value, expected) => {
    expect(hasOwnProperty(value, 'toString')).toBe(expected)
  })
})
