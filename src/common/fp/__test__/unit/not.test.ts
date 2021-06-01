import { not } from '../..'

describe('common - fp - not', () => {
  it.each([
    [() => true, false],
    [() => false, true],
  ])('%p should be resolved as %p', (predicate, expected) => {
    expect(not(predicate)(undefined)).toBe(expected)
  })
})
