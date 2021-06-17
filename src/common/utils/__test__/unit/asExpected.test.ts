import { asExpected } from '../..'

describe('common - utils - asExpected', () => {
  it('should return itself', () => {
    const value = Symbol()
    expect(asExpected(value)).toBe(value)
  })
})
