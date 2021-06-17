import { identity } from '../..'

describe('common - fp - identity', () => {
  it('should return itself', () => {
    const value = Symbol()
    expect(identity(value)).toBe(value)
  })
})
