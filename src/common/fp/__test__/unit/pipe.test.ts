import { pipe } from '../..'

describe('common - fp - some', () => {
  const addOne = (number: number) => ++number

  it.each([
    [[addOne], 0, 1],
    [[addOne, addOne], 0, 2],
  ])('%p should be resolved as %p', (fns, zero, expected) => {
    expect(pipe(...fns)(zero)).toBe(expected)
  })
})
