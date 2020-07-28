import { Evaluable } from '../../../../common/evaluable'
import { operand } from '../../../../__test__/helpers'
import { And } from '../../and'

describe('Expression - Logical - And', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(true), operand(true)], true],
      // Falsy
      [[operand(true), operand(false)], false],
      [[operand(false), operand(true)], false],
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][])
      ('%p should evaluate as %p', (operands, expected) => {
        expect(new And(operands).evaluate({})).toBe(expected)
      })

    test.each([
      [[]],
    ] as [Evaluable[]][])
      ('%p should throw', (operands) => {
        expect(() => new And(operands).evaluate({})).toThrowError()
      })
  })
})