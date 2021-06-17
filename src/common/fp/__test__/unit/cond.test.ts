import { Predicate } from '../../../types'
import { cond, eq, identity } from '../..'
import { constant } from '../../constant'
import { stubTrue } from '../../stubTrue'

describe('common - fp - cond', () => {
  const pairs: [Predicate<unknown>, (value: unknown) => unknown][] = [
    [eq(1), identity],
    [stubTrue, constant(2)],
  ]
  it.each([
    [1, 1],
    [2, 2],
  ])('%p should be resolved as %p', (value, expected) => {
    expect(cond(pairs)(value)).toBe(expected)
  })
})
