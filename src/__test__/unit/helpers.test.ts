import { identityEvaluable, permutation, undefinedOperand } from '../helpers'

describe('tests - helpers', () => {
  describe('permutation', () => {
    it.each([
      [
        [1, 2, 3, 4],
        [
          [1, 2],
          [1, 3],
          [1, 4],
          [2, 3],
          [2, 4],
          [3, 4],
        ],
      ],
    ])('%p should be resolved as %p', (values, expected) => {
      expect(permutation(values)).toStrictEqual(expected)
    })
  })

  test('undefinedOperand', () => {
    const operand = undefinedOperand()
    expect(operand.evaluate({})).toBe(undefined)
    expect(operand.serialize({})).toBe('undefined')
    expect(operand.simplify({})).toBe(undefined)
    expect(operand.toString()).toBe('undefined')
  })

  test('identityEvaluable', () => {
    const operand = identityEvaluable()
    expect(operand.evaluate({})).toBe('expression')
    expect(operand.serialize({})).toBe('expression')
    expect(operand.simplify({})).toBe(operand)
    expect(operand.toString()).toBe('expression')
  })
})
