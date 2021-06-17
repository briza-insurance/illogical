import { some } from '../..'

describe('common - fp - some', () => {
  it.each([
    [() => true, true],
    [() => false, false],
  ])('%p should be resolved as %p', (predicate, expected) => {
    expect(some(predicate)(['value'])).toBe(expected)
  })
})
