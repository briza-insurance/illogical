import { rxMatches } from '../..'

describe('common - fp - rxMatches', () => {
  const pattern = /\d/
  it.each([
    ['a1', true],
    ['a', false],
  ])('%p should be resolved as %p', (value, expected) => {
    expect(rxMatches(pattern)(value)).toBe(expected)
  })
})
