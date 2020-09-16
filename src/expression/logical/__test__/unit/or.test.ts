import { Evaluable } from '../../../../common/evaluable'
import { notSimplified, operand } from '../../../../__test__/helpers'
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

  describe('simplify', () => {
    it.each<[Or, Evaluable | boolean]>([
      [new Or([notSimplified(), operand(false)]), notSimplified()],
      [new Or([notSimplified(), operand(true), notSimplified()]), true ],
      [new Or([operand(false), operand(true)]), true ],
      [new Or([operand(false), operand(false)]), false ],
      [new Or([notSimplified(), operand(false), notSimplified()]), new Or([notSimplified(), notSimplified()])]
    ])('%p should simplify to %p', (and, expected) => {
      expect(and.simplify({})).toEqual(expected)
    })
  })
})
