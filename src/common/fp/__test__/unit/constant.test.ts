import { constant } from '../..'

describe('common - fp - constant', () => {
  it('should return itself', () => {
    const value = Symbol()
    expect(constant(value)()).toBe(value)
  })
})
