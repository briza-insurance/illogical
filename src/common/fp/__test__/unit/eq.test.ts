import { eq } from '../..'

describe('common - fp - eq', () => {
  it.each([
    [1, true],
    [2, false],
  ])('%p should be resolved as %p', (value, expected) => {
    expect(eq(1)(value)).toBe(expected)
  })
})
