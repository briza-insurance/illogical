import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Reference } from '../../../../operand/reference'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { notSimplified, operand } from '../../../../__test__/helpers'
import { Nor } from '../../nor'
import { Not } from '../../not'
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

  describe('simplify', () => {
    it.each<[Xor, Evaluable | boolean]>([
      [new Xor([notSimplified(), operand(false)]), notSimplified()],
      [new Xor([notSimplified(), operand(true), notSimplified()]), new Nor([notSimplified(), notSimplified()]) ],
      [new Xor([notSimplified(), operand(true), operand(false)]), new Not(notSimplified()) ],
      [new Xor([operand(false), operand(true)]), true],
      [new Xor([operand(false), operand(false)]), false],
      [new Xor([operand(true), operand(true), operand(true)]), false],
      [new Xor([operand(true), notSimplified(), operand(true)]), false],
      [new Xor([notSimplified(), operand(false), notSimplified()]), new Xor([notSimplified(), notSimplified()])]
    ])('%p should simplify to %p', (and, expected) => {
      expect(and.simplify({}, [])).toEqual(expected)
    })
  })

  describe('serialize', () => {
    it.each<[[Operand, Operand], [Input, Input]]>([
      [[new Value(10), new Reference('test')], [10, '$test']]
    ])('%p should serialize to %p', (operands, expected) => {
      expect(new Xor(operands).serialize(defaultOptions)).toEqual(['XOR', ...expected])
    })
  })
})
