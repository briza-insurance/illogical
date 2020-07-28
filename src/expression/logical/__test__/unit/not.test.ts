import { Evaluable } from '../../../../common/evaluable'
import { operand } from '../../../../__test__/helpers'
import { Not } from '../../not'

describe('Expression - Logical - Not', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand(false), true],
      // Falsy
      [operand(true), false],
    ] as [Evaluable, boolean][])
      ('%p should evaluate as %p', (operand, expected) => {
        expect(new Not(operand).evaluate({})).toBe(expected)
      })

    test.each([
      [[]],
      [[operand(true), operand(false)] ],
      [[operand(0)] ], 
    ] as [Evaluable[]][])
      ('%p should throw', (operands) => {
        expect(() => new Not(...operands).evaluate({})).toThrowError()
      })
  })
})
