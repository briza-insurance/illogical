import { Evaluable } from '../../../../common/evaluable'
import { operand } from '../../../../__test__/helpers'
import { Xor } from '../../xor'

describe('Expression - Logical - Xor', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(true), operand(false)], true],
      [[operand(false), operand(true)], true],
      // Falsy
      [[operand(true), operand(true)], false],
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][])
      ('%p should evaluate as %p', (operands, expected) => {
        expect(new Xor(operands).evaluate({})).toBe(expected)
      })

    test.each([
      [[]],
    ] as [Evaluable[]][])
      ('%p should throw', (operands) => {
        expect(() => new Xor(operands).evaluate({})).toThrowError()
      })
  })
})
