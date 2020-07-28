import { Evaluable } from '../../../../common/evaluable'
import { operand } from '../../../../__test__/helpers'
import { Or } from '../../or'

describe('Expression - Logical - Or', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(true), operand(false)], true],
      [[operand(false), operand(true)], true],
      [[operand(true), operand(true)], true],
      // Falsy
      [[operand(false), operand(false)], false]
    ] as [Evaluable[], boolean][])
      ('%p should evaluate as %p', (operands, expected) => {
        expect(new Or(operands).evaluate({})).toBe(expected)
      })

    test.each([
      [[]],
    ] as [Evaluable[]][])
      ('%p should throw', (operands) => {
        expect(() => new Or(operands).evaluate({})).toThrowError()
      })
  })
})
