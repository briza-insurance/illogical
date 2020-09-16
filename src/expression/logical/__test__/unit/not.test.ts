import { Evaluable } from '../../../../common/evaluable'
import { notSimplified, operand } from '../../../../__test__/helpers'
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

  describe('simplify', () => {
    it.each<[Not, Evaluable | boolean]>([
      [new Not(notSimplified()), new Not(notSimplified())],
      [new Not(operand(false)), true ],
      [new Not(operand(true)), false ],
    ])('%p should simplify to %p', (and, expected) => {
      expect(and.simplify({})).toEqual(expected)
    })
  })
})
