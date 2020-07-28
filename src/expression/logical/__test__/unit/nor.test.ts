import { Evaluable } from '../../../../common/evaluable'
import { operand } from '../../../../__test__/helpers'
import { Nor } from '../../nor'

describe('Expression - Logical - Nor', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(false), operand(false)], true],
      // Falsy
      [[operand(true), operand(false)], false],
      [[operand(false), operand(true)], false],
      [[operand(true), operand(true)], false],
    ] as [Evaluable[], boolean][])
      ('%p should evaluate as %p', (operands, expected) => {
        expect(new Nor(operands).evaluate({})).toBe(expected)
      })

    test.each([
      [[]],
    ] as [Evaluable[]][])
      ('%p should throw', (operands) => {
        expect(() => new Nor(operands).evaluate({})).toThrowError()
      })
  })
})
