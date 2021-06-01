import { map } from '../..'

describe('common - fp - map', () => {
  const fn = (value: unknown) => `${value}`
  it.each([
    [
      [1, 2, 3],
      ['1', '2', '3'],
    ],
  ])('%p should be mapped as %p', (functor, expected) => {
    expect(map(fn)(functor)).toStrictEqual(expected)
  })
})
