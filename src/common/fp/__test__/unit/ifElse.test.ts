import { eq, ifElse } from '../..'

describe('common - fp - ifElse', () => {
  it.each([
    [1, 1],
    [2, 2],
  ])('%p should be resolved as %p', (value, expected) => {
    expect(
      ifElse(
        eq(1),
        () => 1,
        () => 2
      )(value)
    ).toBe(expected)
  })
})
